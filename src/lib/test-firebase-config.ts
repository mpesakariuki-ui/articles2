import { getAdminAuth, getAdminDb } from './admin';

async function testFirebaseConfig() {
    try {
        // Try to initialize Firebase Admin
        const auth = getAdminAuth();
        const db = getAdminDb();
        
        // Test a simple operation
        await db.collection('test').doc('test').set({
            test: true,
            timestamp: new Date()
        });
        
        console.log('✅ Firebase Admin SDK initialized successfully');
        console.log('✅ Firestore write test passed');
        
        // Clean up test data
        await db.collection('test').doc('test').delete();
        
    } catch (error) {
        console.error('❌ Error testing Firebase configuration:');
        console.error(error);
        process.exit(1);
    }
}

// Only run if called directly
if (require.main === module) {
    testFirebaseConfig();
}
