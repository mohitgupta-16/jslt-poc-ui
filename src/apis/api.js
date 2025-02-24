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


const transformData = async (file) => {
  const formData = new FormData();
  formData.append('jsltConfigTemplate', file);

  const loaderSummaryId = '6843-250217-69FX';
  const voId = "6c583b71-9508-4fef-9d03-574b7e42c7a3"
  const userId = 'tho_cor147@hdfclife.com';

  const url = `${API_URLS.BASE_URL}voId/${voId}/loaderSummaryId/${loaderSummaryId}/transform`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
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

export { fetchExcelData, transformData };
