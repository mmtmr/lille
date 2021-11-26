const router = require("express").Router();
const authorize = require("../middleware/authorize");
const notion = require("../notion");
require("dotenv").config();

const databaseId = process.env.NOTION_DATABASE_ID

//Query database
router.get('/notion',async(req,res)=>{
  try {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          and: [
            {
              property: 'Status',
              select: {
                is_not_empty: true,
              },
            },
            {
              property: 'Status',
              select: {
                does_not_equal: 'Completed',
              },
            },
          ],
        },
        sorts: [
          {
            property: 'Priority',
            direction: 'descending',
          },
          {
            property: 'Status',
            direction: 'descending',
          },
        ],
      });
      res.json(response.results);
  } catch (error) {
    console.error(error.body);
    res.sendStatus(500);

  }
})

//Query database
router.put('/notion',async(req,res)=>{
  try {
    const {id}=req.body;
    const response = await notion.pages.update({
      page_id: id,
      properties: {
        'Status': {
          select:{
            "name": "Completed"
          }
        },
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error.body);
    res.sendStatus(500);

  }
})
module.exports = router;