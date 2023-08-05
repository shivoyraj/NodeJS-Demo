const { openDBConnection, closeDBConnection } = require('./mongodb');

async function addEmployee(employeePayload, identityPayload) {
    try {
        const db = await openDBConnection();

        let employee = await db.collection('employee')
            .findOne({ id: employeePayload.id });

        if (employee)
            throw new Error(`Employee with empId ${employeePayload.id} already exist.`)

        let identity = await db.collection('identity')
            .findOne({ $or: [{ email: identityPayload.email }, { address: identityPayload.address }] });

        if (identity)
            throw new Error('Identity with the same email or address already exists');

        // Insert into the identity collection first to get the _id
        const identityResult = await db.collection('identity').insertOne(identityPayload);
        console.log('Identity data inserted successfully.');

        // Add the identity reference to the employee data
        employeePayload.identity = identityResult.insertedId;

        // Insert into the employee collection with the reference to the identity
        const employeeResult = await db.collection('employee').insertOne(employeePayload);
        console.log('Employee data inserted successfully.');

        // Update the identity object with a reference to the employee
        await db.collection('identity').updateOne(
            { _id: identityResult.insertedId },
            { $set: { employee: employeeResult.insertedId } }
        );
        console.log('Identity updated with the employee reference.');
    } catch (error) {
        console.error('Error inserting data:', error);
    } finally {
        closeDBConnection();
    }
}


// // Sample input data for employee
// const employee = {
//     id: 111,
//     name: 'John Doe',
//     age: 30,
// };
// // Sample input data for identity
// const identity = {
//     address: '123 Main Street',
//     email: 'john.doe@example.com',
// };
// addEmployee(employee, identity);


// Sample input data for employee
const employee = {
    id: 222,
    name: 'Roy',
    age: 32,
};
// Sample input data for identity
const identity = {
    address: '456 xyz Street',
    email: 'roy@example.com',
};
addEmployee(employee, identity);