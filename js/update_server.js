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
    {
        url: 'http://free7.sshtproject.com:8888/servers/online',
        elementId: 'free7-status',
    },
    {
        url: 'http://free8.sshtproject.com:8888/servers/online',
        elementId: 'free8-status',
    },
    {
        url: 'http://free9.sshtproject.com:8888/servers/online',
        elementId: 'free9-status',
    },
    {
        url: 'http://free10.sshtproject.com:8888/servers/online',
        elementId: 'free10-status',
    },
    {
        url: 'http://free11.sshtproject.com:8888/servers/online',
        elementId: 'free11-status',
    },
    {
        url: 'http://free12.sshtproject.com:8888/servers/online',
        elementId: 'free12-status',
    },
    {
        url: 'http://free13.sshtproject.com:8888/servers/online',
        elementId: 'free13-status',
    },
    {
        url: 'http://free14.sshtproject.com:8888/servers/online',
        elementId: 'free14-status',
    },
    {
        url: 'http://free15.sshtproject.com:8888/servers/online',
        elementId: 'free15-status',
    }
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

