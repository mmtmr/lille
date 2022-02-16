const router = require("express").Router();
const authorize = require("../middleware/authorize");
const notion = require("../notion");
const pool = require("../db");
require("dotenv").config();

// const databaseId = process.env.NOTION_DATABASE_ID

//Query database
router.get('/notion', async (req, res) => {
  try {
    const user_id = req.header("user_id");
    const findDatabaseID = await pool.query(
      "SELECT opt_notion_database_id FROM OPTION_T WHERE user_id=$1;",
      [user_id]
    );

    const { opt_notion_database_id } = await findDatabaseID.rows[0];

    const response = await notion.databases.query({
      database_id: opt_notion_database_id,
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
    console.error(error.message);
    res.sendStatus(500);
  }
})

//Query database
router.put('/notion', authorize, async (req, res) => {
  try {
    // const user_id = req.header("user_id");
    // const databaseId = await pool.query(
    //   "SELECT opt_notion_database_id FROM OPTION_T WHERE user_id=$1;",
    //   [user_id]
    // );
    const { id } = req.body;
    const response = await notion.pages.update({
      page_id: id,
      properties: {
        'Status': {
          select: {
            "name": "Completed"
          }
        },
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);

  }
})
module.exports = router;