import API_URLS from '../configs/apiUrls.js';

const fetchExcelData = async (loaderSummaryId, partnerId, industryType, formatType, userId) => {
  const url = `${API_URLS.GET_DATA}?loaderSummaryId=${loaderSummaryId}&partnerId=${partnerId}&industryType=${industryType}&formatType=${formatType}&userId=${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
