const { openDBConnection, closeDBConnection } = require('./mongodb');

async function updateEmployee(employeeId, payload) {
    try {
        const db = await openDBConnection();

        // Find the employee by their ID
        const employee = await db.collection('employee')
            .findOne({ id: employeeId });
        if (!employee)
            throw new Error('Employee not found');

        let identity = await db.collection('identity')
            .findOne({
                $or: [{ email: payload.identity.email },
                { address: payload.identity.address }]
            });
        if (identity)
            throw new Error('Identity already associated with existing Employee');

        // Update the employee document
        await db.collection('employee').updateOne(
            { id: employeeId },
            { $set: { ...employee, ...payload, identity: employee.identity } }
        );
        console.log('Employee data updated successfully.');

        identity = await db.collection('identity')
            .findOne({ employee: employee._id });
        // Update the Identity document
        await db.collection('identity').updateOne(
            { employee: employee._id },
            { $set: { ...identity, ...payload.identity, employee: employee._id } }
        );
        console.log('Employee Identity updated successfully.');
    } catch (error) {
        console.error('Error updating employee data:', error);
    } finally {
        closeDBConnection();
    }
}


const employeeId = 111;
const payload = {
    name: 'John H Doe',
    identity : {}
};

updateEmployee(employeeId, payload);

