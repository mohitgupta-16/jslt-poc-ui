import API_URLS from '../configs/apiUrls.js';

const fetchExcelData = async () => {
  const loaderSummaryId = '6843-250217-69FX';
  const partnerId = '68437580';
  const industryType = 'Non-MFI';
  const formatType = 'Education loan';
  const userId = 'tho_cor147@hdfclife.com';

  const url = `${API_URLS.BASE_URL}loaderSummaries/${loaderSummaryId}/rawMembers/download?partnerId=${partnerId}&industryType=${industryType}&formatType=${formatType}&pageNumber=0&pageSize=10`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-ID': userId,
        'Access-Control-Allow-Origin': '*'
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Request failed', error);
    return null;
  }
};


const uploadJsltFileData = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('VoId', '');

  try {
    const response = await fetch(API_URLS.POST_UPLOAD, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Request failed', error);
    return null;
  }
};

export { fetchExcelData, uploadJsltFileData };
