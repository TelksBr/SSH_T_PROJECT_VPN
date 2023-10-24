fetch('https://bot.sshtproject.com/get_plains')
        .then(response => response.text())
        .then(data => {
          document.getElementById("conteiner").innerHTML = data;
        }).catch(err => { return });