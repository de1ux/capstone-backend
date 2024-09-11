import Sequelize from "sequelize";
import PostModel from "./Post.js";
import CommentModel from "./Comment.js";
import UserModel from "./User.js";
import seedData from "./seedData.json" with {type: "json"};

// process.env.DATABASE_URL
/*

1. process.env.DATABASE_URL === postgres://postgres:AP1MpZK2tOQzQIU@capstone-backend-young-pond-3810-db.flycast:5432
2. process.env.DATABASE_URL === undefined

*/

let db;
if (process.env.DATABASE_URL === undefined) {
	console.log("Connected locally!");
	db = new Sequelize("postgres://localhost:5432/blog", {
		logging: false,
	});	
} else {
	db = new Sequelize(process.env.DATABASE_URL, {
		logging: false,
	});
}

const Post = PostModel(db);
const User = UserModel(db);
const Comment = CommentModel(db);

Post.belongsTo(User, { foreignKey: "authorID" });

const connectToDB = async () => {
	try {
		await db.authenticate();
		console.log("Connected to DB");

		await db.sync(); //{ alter: true }

		const existingPosts = await Post.findAll();
		if (existingPosts.length < 5) {
			for (const eachSeed of seedData){
				await Post.create(eachSeed);
			}
		}
	} catch (error) {
		console.error(error);
		console.error("DB Connection FAILED!");
	}
};

await connectToDB();

export { db, Post, Comment, User };
