// Simplified Netlify Function for testing
exports.handler = async (event, context) => {
  try {
    // Parse query parameters
    const params = event.queryStringParameters;
    const tahun = params.tahun || '2023';
    const indikator = params.indikator || 'populasi';
    
    console.log(`Processing request for tahun=${tahun}, indikator=${indikator}`);
    
    // Create a sample GeoJSON response for testing
    const sampleData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [106.8456, -6.2088]
          },
          properties: {
            id: 1,
            provinsi: 'DKI Jakarta',
            kabupaten: null,
            populasi: 10562088,
            populasi_produktif: 7393461,
            persentase_produktif: 70.0,
            tahun: parseInt(tahun),
            indikator: indikator,
            nilai: 85.2,
            kategori: 'Tinggi'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [110.4203, -7.7956]
          },
          properties: {
            id: 2,
            provinsi: 'Jawa Tengah',
            kabupaten: null,
            populasi: 34552500,
            populasi_produktif: 23828225,
            persentase_produktif: 69.0,
            tahun: parseInt(tahun),
            indikator: indikator,
            nilai: 76.8,
            kategori: 'Sedang'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [115.2126, -8.6524]
          },
          properties: {
            id: 3,
            provinsi: 'Bali',
            kabupaten: null,
            populasi: 4317404,
            populasi_produktif: 3023183,
            persentase_produktif: 70.0,
            tahun: parseInt(tahun),
            indikator: indikator,
            nilai: 80.5,
            kategori: 'Tinggi'
          }
        }
      ]
    };
    
    // Return GeoJSON response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(sampleData)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'error',
        message: error.message
      })
    };
  }
};
