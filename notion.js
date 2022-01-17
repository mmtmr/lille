const { Client } = require("@notionhq/client")
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// async function getDatabase() {
//   try {
//     const response = await notion.databases.query({
//         database_id: databaseId,
//         filter: {
//           and: [
//             {
//               property: 'Status',
//               select: {
//                 is_not_empty: true,
//               },
//             },
//             {
//               property: 'Status',
//               select: {
//                 does_not_equal: 'Completed',
//               },
//             },
//           ],
//         },
//         sorts: [
//           {
//             property: 'Priority',
//             direction: 'descending',
//           },
//           {
//             property: 'Status',
//             direction: 'descending',
//           },
//         ],
//       });
//       console.log(response);
//   } catch (error) {
//     console.error(error.body)
//   }
// }

// getDatabase()

module.exports=notion;