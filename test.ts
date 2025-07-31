async function getShbDoc(question: string) {
  try {
    const apiKey = 'dataset-vVgNQ8YeEPRaVBubH0WjlhIB';
    const datasetId = '46434171-4d62-4d51-8049-2b74597bdd5b'
    const url = `http://dify-test.shb.ltd/v1/datasets/${datasetId}/retrieve`;
    
    const requestBody = {
      query: question,
      retrieval_model: {
        search_method: "hybrid_search",
        reranking_enable: true,
        reranking_mode: null,
        reranking_model: {
          reranking_provider_name: "tongyi",
          reranking_model_name: "gte-rerank-v2"
        },
        weights: null,
        top_k: 5,
        score_threshold_enabled: true,
        score_threshold: 0.5
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('检索结果 1:', JSON.stringify(data));

    const results = extractContentAndName(data);

    console.log('检索结果 2:', JSON.stringify(results));
    
    return results;

  } catch (error) {
    console.error('getShbDoc API 请求失败:', error);
    throw error;
  }
}

function extractContentAndName(data: Record<string, any>) {

  const results: { documentContent: string, documentName: string }[] = [];
  
  if (data.records && Array.isArray(data.records)) {
    for (const record of data.records) {
      if (record.segment) {
        results.push({
          documentContent: record.segment.content,
          documentName: record.segment.document.name
        });
      }
    }
  }
  
  return results;
}

console.log(getShbDoc('什么是服务事件'));