import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { Class } from "../entities/Class";
import { Folder } from "../entities/Folder";
import { Deck } from "../entities/Deck";
import { Flashcard } from "../entities/Flashcard";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { AppDataSource } from "../../ormconfig";

// Just for testing
const SALT_ROUNDS = 10;

async function seed() {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const dataSource = AppDataSource;
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const classRepository = dataSource.getRepository(Class);
    const folderRepository = dataSource.getRepository(Folder);
    const deckRepository = dataSource.getRepository(Deck);
    const flashcardRepository = dataSource.getRepository(Flashcard);

    // Clear existing data
    await dataSource.synchronize(true);

    // Create roles
    const roles = ["admin", "teacher", "student"];
    const roleEntities = roles.map((name) => {
        const role = new Role();
        role.name = name;
        return role;
    });
    await roleRepository.save(roleEntities);

    // Create users
    const users = [];
    for (let i = 0; i < 1000; i++) {
        const user = new User();
        user.email = faker.internet.email();
        user.password = await bcrypt.hash("password123", SALT_ROUNDS);
        user.username = faker.internet.username();
        user.dob = faker.date.past({ years: 30 });
        user.avatar_url = faker.image.avatar();
        users.push(user);
    }
    await userRepository.save(users);

    // Create classes
    const classes = [];
    for (let i = 0; i < 1000; i++) {
        const classEntity = new Class();
        classEntity.name = faker.company.name();
        classEntity.author = users[Math.floor(Math.random() * users.length)];
        classEntity.studentQuantity = faker.number.int({ min: 0, max: 100 });
        classes.push(classEntity);
    }
    await classRepository.save(classes);

    // Create folders
    const folders = [];
    for (let i = 0; i < 1000; i++) {
        const folder = new Folder();
        folder.name = faker.commerce.department();
        folder.author = users[Math.floor(Math.random() * users.length)];
        folder.visibility = Math.random() > 0.5 ? "public" : "private";
        folders.push(folder);
    }
    await folderRepository.save(folders);

    // Create decks
    const decks = [];
    for (let i = 0; i < 1000; i++) {
        const deck = new Deck();
        deck.name = faker.lorem.words(3);
        deck.description = faker.lorem.sentence();
        deck.author = users[Math.floor(Math.random() * users.length)];
        deck.visibility = Math.random() > 0.5 ? "public" : "private";
        decks.push(deck);
    }
    await deckRepository.save(decks);

    // Create flashcards
    const flashcards = [];
    for (let i = 0; i < 1000; i++) {
        const flashcard = new Flashcard();
        flashcard.deck = decks[Math.floor(Math.random() * decks.length)];
        flashcard.frontText = faker.lorem.sentence();
        flashcard.backText = faker.lorem.sentence();
        flashcard.imageUrl = Math.random() > 0.7 ? faker.image.url() : undefined;
        flashcard.audioUrl = Math.random() > 0.8 ? faker.internet.url() : undefined;
        flashcard.description = faker.lorem.paragraph();
        flashcards.push(flashcard);
    }
    await flashcardRepository.save(flashcards);

    console.log("Seeding completed successfully!");
}

seed().catch((error) => {
    console.error("Error seeding database:", error);
});
