async function updateServerStatus() {
    const serverStatusElements = [{
        url: 'http://premium.sshtproject.com:8888/servers/online',
        elementId: 'premium1-status',
    },
    {
        url: 'http://premium2.sshtproject.com:8888/servers/online',
        elementId: 'premium2-status',
    },
    {
        url: 'http://free1.sshtproject.com:8888/servers/online',
        elementId: 'free1-status',
    },
    {
        url: 'http://free2.sshtproject.com:8888/servers/online',
        elementId: 'free2-status',
    },
    {
        url: 'http://free3.sshtproject.com:8888/servers/online',
        elementId: 'free3-status',
    },
    {
        url: 'http://free4.sshtproject.com:8888/servers/online',
        elementId: 'free4-status',
    },
    {
        url: 'http://free5.sshtproject.com:8888/servers/online',
        elementId: 'free5-status',
    },
    {
        url: 'http://free6.sshtproject.com:8888/servers/online',
        elementId: 'free6-status',
    },
    ];

    let totalOnline = 0;

    // Crie uma lista de promessas para buscar o status de cada servidor
    const serverStatusPromises = serverStatusElements.map(async (server) => {
        try {
            const onlineCount = await fetchServerStatus(server.url, server.elementId);
            totalOnline += onlineCount;

            // Atualize o total de usuários aqui, a cada solicitação concluída
            document.getElementById('total-status').textContent = `${totalOnline}`;
        } catch (error) {
            console.error(`Erro ao buscar dados do servidor (${server.url}):`, error);
            // Caso ocorra um erro, você pode definir um valor padrão ou tratar de outra forma
            document.getElementById(server.elementId).textContent = 'Erro';
        }
    });

    // Aguarde que todas as promessas sejam resolvidas
    await Promise.all(serverStatusPromises);

}

updateServerStatus();

// async function fetchServerData() {
//     try {
//         const response = await fetch('https://ports.sshtproject.com/check_port.php');
//         if (!response.ok) {
//             throw new Error('Erro ao buscar dados da API');
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar dados da API:', error);
//         return []; // Retorna um array vazio em caso de erro
//     }
// }

// Função para atualizar os elementos das portas com emojis
// async function updatePortStatus() {
//     const serverData = await fetchServerData();
//     serverData.forEach(server => {
//         // Itere pelas portas e atualize o status das portas em uma única linha
//         const portStatusText = [];

//         // Itere pelas portas (80, 8080, 443, 7300)
//         [80, 8080, 443].forEach(port => {
//             if (server[`port-${port}`] === 'Online') {
//                 portStatusText.push(`${port}: 🟢`);
//             } else {
//                 portStatusText.push(`${port}: 🔴`);
//             }
//         });

//         const portId = `port-${server.id}`;
//         const portElement = document.getElementById(portId);

//         if (portElement) {
//             portElement.textContent =
//                 `Portas: ${portStatusText.join(' - ')}`; // Atualize o conteúdo da porta
//         }
//     });
// }

document.addEventListener('DOMContentLoaded', function () {
    updateServerStatus(); // Atualiza os status dos servidores ao carregar a página

});

function fetchServerStatus(serverUrl, elementId) {
    return new Promise((resolve, reject) => {
        $.get(serverUrl, function (data) {
            document.getElementById(elementId).textContent = `${data}`;
            resolve(parseInt(data));
        });
    });
}


// Update the server status when the button is clicked
document.getElementById("refresh-button").addEventListener("click", function () {
    updateServerStatus();
});