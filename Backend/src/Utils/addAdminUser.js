import { User } from '../Models/user.model.js';  // Adjust the import based on your project structure
import { ROLES, AdminData } from '../constants.js'; // Import your ROLES constant


async function createAdminUser() {
    const adminExists = await User.findOne({
        where: {
            userEmail: AdminData.ADMIN_EMAIL,
        }
    });

    if (!adminExists) {
        // const hashedPassword = await bcrypt.hash(AdminData.ADMIN_PASSWORD, 10);
        await User.create({
            firstName: 'Admin',
            lastName: 'User',
            userEmail: AdminData.ADMIN_EMAIL,
            password: AdminData.ADMIN_PASSWORD,
            role: ROLES.ADMIN,
            Status: 'active',
        });
        console.log("\nAdmin User Created Successfully\n");
    }
    else {
        console.log("\nAdmin User Already Exists.\n");
    }
}

export default createAdminUser;


 