async function updateServerStatus() {
    const _0x20a06f = [
      {
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
        url: 'http://free11.sshtproject.com:8880/servers/online',
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
      },
    ]
    let _0x5eb9c9 = 0
    const _0x520cea = _0x20a06f.map(async (_0x116d53) => {
      try {
        const _0x14d0c4 = await fetchServerStatus(
          _0x116d53.url,
          _0x116d53.elementId
        )
        _0x5eb9c9 += _0x14d0c4
        document.getElementById('total-status').textContent = '' + _0x5eb9c9
      } catch (_0x39e89d) {
        console.error(
          'Erro ao buscar dados do servidor (' + _0x116d53.url + '):',
          _0x39e89d
        )
        document.getElementById(_0x116d53.elementId).textContent = 'Erro'
      }
    })
    await Promise.all(_0x520cea)
  }
  updateServerStatus()
  document.addEventListener('DOMContentLoaded', function () {
    updateServerStatus()
  })
  function fetchServerStatus(_0x2beda9, _0x2a4029) {
    return new Promise((_0x302470, _0xa00468) => {
      $.get(_0x2beda9, function (_0x282cce) {
        document.getElementById(_0x2a4029).textContent = '' + _0x282cce
        _0x302470(parseInt(_0x282cce))
      })
    })
  }
  document
    .getElementById('refresh-button')
    .addEventListener('click', function () {
      updateServerStatus()
    })
  