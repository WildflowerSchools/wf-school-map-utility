const AirTable = require("airtable")
const parser = require("parse-address")

const base = AirTable.base(process.env.AIRTABLE_BASE)

const getSchoolRecords = () => {
  const table = base("Schools")

  let records = []
  return new Promise((resolve, reject) => {
    const processPage = (partialRecords, fetchNextPage) => {
      records = [...records, ...partialRecords]
      fetchNextPage()
    }

    const processRecords = (err) => {
      if (err) {
        console.error(err)
      }

      const parseAddress = (address) => {
        const parsed = parser.parseLocation(address)

        let parts = []
        if (parsed.hasOwnProperty("number")) {
          parts.push(parsed["number"])
        }
        if (parsed.hasOwnProperty("prefix")) {
          parts.push(parsed["prefix"])
        }
        if (parsed.hasOwnProperty("street")) {
          parts.push(parsed["street"])
        }
        if (parsed.hasOwnProperty("type")) {
          parts.push(parsed["type"])
        }

        return {
          full: address,
          street: parts.join(" "),
          city: parsed["city"] || "",
          state: parsed["state"] || "",
          zip: parsed["zip"] || "",
        }
      }

      const cleanedRecords = records.map((r) => {
        return {
          id: r["id"],
          name: r["fields"]["Name"],
          logo:
            r["fields"]["Logo"] && r["fields"]["Logo"].length
              ? r["fields"]["Logo"][0]
              : null,
          ages: r["fields"]["Ages served"],
          email: r["fields"]["School Email"],
          website: r["fields"]["Website"],
          // teacher_leaders: r['fields']['Current TLs'],
          calendar: r["fields"]["School calendar"],
          facebook: r["fields"]["Facebook"],
          instagram: r["fields"]["Instagram"],
          hub: r["fields"]["Hub"],
          address:
            r["fields"]["Address (from Locations)"] &&
            r["fields"]["Address (from Locations)"].length
              ? parseAddress(r["fields"]["Address (from Locations)"][0])
              : null,
          latitude:
            r["fields"]["Latitude"] && r["fields"]["Latitude"].length
              ? r["fields"]["Latitude"][0]
              : null,
          longitude:
            r["fields"]["Longitude"] && r["fields"]["Longitude"].length
              ? r["fields"]["Longitude"][0]
              : null,
          charter: r["fields"]["Charter"],
        }
      })

      resolve(cleanedRecords)
    }

    table.select({ view: "Open schools" }).eachPage(processPage, processRecords)
  })
}

const getLocationRecordById = (id) => {
  return new Promise((resolve, reject) => {
    const processRecord = (err, record) => {
      if (err) {
        reject(err)
        return
      }
      const id = { id: record.id }
      const fields = {
        latitude: record.fields["Latitude"],
        longitude: record.fields["Longitude"],
      }
      record = { ...id, ...fields }
      resolve(record)
    }
    base("Locations").find(id, processRecord)
  })
}

module.exports = { getSchoolRecords, getLocationRecordById }
