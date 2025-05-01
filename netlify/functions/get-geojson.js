// Netlify Function untuk menggantikan get_geojson.php
const { createClient } = require('@supabase/supabase-js');

// Inisialisasi Supabase client (alternatif database untuk Netlify)
// Anda perlu membuat akun Supabase dan mengisi URL dan key yang sesuai
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Ambil parameter dari query string
    const params = event.queryStringParameters;
    const tahun = params.tahun || '2023';
    const indikator = params.indikator || 'populasi';
    
    console.log(`Processing request for tahun=${tahun}, indikator=${indikator}`);
    
    // Query data dari Supabase (pengganti MySQL)
    const { data: demografiData, error: demografiError } = await supabase
      .from('demografi')
      .select('*')
      .eq('tahun', tahun);
      
    if (demografiError) throw demografiError;
    
    const { data: sdgsData, error: sdgsError } = await supabase
      .from('sdgs')
      .select('*')
      .eq('tahun', tahun)
      .eq('indikator', indikator);
      
    if (sdgsError) throw sdgsError;
    
    // Gabungkan data demografi dan sdgs
    const combinedData = demografiData.map(demo => {
      const sdgs = sdgsData.find(s => s.provinsi === demo.provinsi);
      return {
        ...demo,
        indikator: sdgs ? sdgs.indikator : null,
        nilai: sdgs ? sdgs.nilai : null,
        kategori: sdgs ? sdgs.kategori : null
      };
    });
    
    // Buat GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: combinedData
        .filter(item => item.latitude && item.longitude) // Filter hanya yang punya koordinat
        .map(item => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)]
          },
          properties: {
            id: item.id,
            provinsi: item.provinsi,
            kabupaten: item.kabupaten || null,
            populasi: parseInt(item.populasi),
            populasi_produktif: parseInt(item.populasi_produktif),
            persentase_produktif: parseFloat(item.persentase_produktif),
            tahun: parseInt(item.tahun),
            indikator: item.indikator,
            nilai: item.nilai ? parseFloat(item.nilai) : null,
            kategori: item.kategori
          }
        }))
    };
    
    // Return GeoJSON response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(geojson)
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
