async function updateServerStatus() {
  const servers = [
    {
      url: 'http://premium1.sshtproject.com:8888/online',
      elementId: 'premium1-status',
    },
    {
      url: 'http://premium2.sshtproject.com:8888/online',
      elementId: 'premium2-status',
    },
    // {
    //   url: 'http://premium3.sshtproject.com:2082/online',
    //   elementId: 'premium3-status',
    // },
    {
      url: 'http://free1.sshtproject.com:8888/online',
      elementId: 'free1-status',
    },
    {
      url: 'http://free2.sshtproject.com:8888/online',
      elementId: 'free2-status',
    },
    {
      url: 'http://free3.sshtproject.com:8888/online',
      elementId: 'free3-status',
    },
    {
      url: 'http://free4.sshtproject.com:8888/online',
      elementId: 'free4-status',
    },
    {
      url: 'http://free5.sshtproject.com:8888/online',
      elementId: 'free5-status',
    },
    {
      url: 'http://free6.sshtproject.com:8888/online',
      elementId: 'free6-status',
    },
    {
      url: 'http://free7.sshtproject.com:8888/online',
      elementId: 'free7-status',
    },
    {
      url: 'http://free8.sshtproject.com:8888/online',
      elementId: 'free8-status',
    },
    {
      url: 'http://free9.sshtproject.com:8888/online',
      elementId: 'free9-status',
    },
    {
      url: 'http://free10.sshtproject.com:8888/online',
      elementId: 'free10-status',
    },
    {
      url: 'http://free11.sshtproject.com:8888/online',
      elementId: 'free11-status',
    },
    {
      url: 'http://free12.sshtproject.com:8888/online',
      elementId: 'free12-status',
    },
    {
      url: 'http://free13.sshtproject.com:8888/online',
      elementId: 'free13-status',
    },
    {
      url: 'http://free14.sshtproject.com:8888/online',
      elementId: 'free14-status',
    },
    {
      url: 'http://free15.sshtproject.com:8888/online',
      elementId: 'free15-status',
    },
  ]
  let totalOnlineServers = 0
  const fetches = servers.map(async (server) => {
    try {
      const onlineCount = await fetchServerStatus(server.url, server.elementId)
      totalOnlineServers += onlineCount
      document.getElementById('total-status').textContent = '' + totalOnlineServers
    } catch (error) {
      console.error(
        'Erro ao buscar dados do servidor (' + server.url + '):',
        error
      )
      document.getElementById(server.elementId).textContent = 'Erro'
    }
  })
  await Promise.all(fetches)
}
updateServerStatus()
document.addEventListener('DOMContentLoaded', function () {
  updateServerStatus()
})
function fetchServerStatus(url, elementId) {
  return new Promise((resolve, reject) => {
    $.get(url, function (data) {
      document.getElementById(elementId).textContent = '' + data
      resolve(parseInt(data))
    })
  })
}
document
  .getElementById('refresh-button')
  .addEventListener('click', function () {
    updateServerStatus()
  })
