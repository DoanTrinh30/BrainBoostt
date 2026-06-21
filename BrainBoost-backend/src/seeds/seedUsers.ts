import { AppDataSource } from '../../ormconfig';
import { User } from '../entities/User';
import * as argon2 from 'argon2';

export const seedUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Check if admin already exists (to avoid duplicate seeding)
    const adminExists = await userRepository.findOne({
      where: { email: 'admin@example.com' }
    });

    if (adminExists) {
      console.log('✅ Test accounts already exist, skipping seed');
      return;
    }

    const hashedPassword = await argon2.hash('12345');

    // Seed student account
    await userRepository.save({
      email: 'student@example.com',
      password: hashedPassword,
      username: 'Student',
      role: 'student',
      status: 'active'
    });

    console.log('✅ Student account created: student@example.com (password: 12345)');

    // Seed teacher account
    await userRepository.save({
      email: 'teacher@example.com',
      password: hashedPassword,
      username: 'Teacher',
      role: 'teacher',
      status: 'active'
    });

    console.log('✅ Teacher account created: teacher@example.com (password: 12345)');

    // Seed admin account
    await userRepository.save({
      email: 'admin@example.com',
      password: hashedPassword,
      username: 'Admin',
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Admin account created: admin@example.com (password: 12345)');

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};