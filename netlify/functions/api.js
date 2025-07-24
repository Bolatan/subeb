// netlify/functions/api.js
const mongoose = require('mongoose');

// Connection helper
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = connection;
  return connection;
}

// Your schema/model (adjust as needed)
const YourSchema = new mongoose.Schema({
  // Define your schema here
  name: String,
  // ... other fields
});

const YourModel = mongoose.models.YourModel || mongoose.model('YourModel', YourSchema);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    await connectToDatabase();

    const { httpMethod, path, body } = event;
    const pathSegments = path.split('/').filter(segment => segment);
    
    // Remove 'api' from path if present
    if (pathSegments[0] === 'api') {
      pathSegments.shift();
    }

    switch (httpMethod) {
      case 'GET':
        if (pathSegments.length === 0) {
          // GET /api - get all items
          const items = await YourModel.find({});
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(items),
          };
        } else {
          // GET /api/:id - get specific item
          const id = pathSegments[0];
          const item = await YourModel.findById(id);
          if (!item) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Item not found' }),
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(item),
          };
        }

      case 'POST':
        // POST /api - create new item
        const newItem = new YourModel(JSON.parse(body));
        const savedItem = await newItem.save();
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(savedItem),
        };

      case 'PUT':
        if (pathSegments.length > 0) {
          // PUT /api/:id - update item
          const id = pathSegments[0];
          const updatedItem = await YourModel.findByIdAndUpdate(
            id,
            JSON.parse(body),
            { new: true }
          );
          if (!updatedItem) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Item not found' }),
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(updatedItem),
          };
        }
        break;

      case 'DELETE':
        if (pathSegments.length > 0) {
          // DELETE /api/:id - delete item
          const id = pathSegments[0];
          const deletedItem = await YourModel.findByIdAndDelete(id);
          if (!deletedItem) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Item not found' }),
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Item deleted successfully' }),
          };
        }
        break;

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};