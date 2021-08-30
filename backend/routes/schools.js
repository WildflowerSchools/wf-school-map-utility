const express = require('express')
const router = express.Router()

const wfSchoolDB = require('../airtable')

router.get('/', async function(req, res, next) {
  res.json(await wfSchoolDB.getSchoolRecords())
})

module.exports = router