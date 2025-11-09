fetch("./data/viagens.json") // fetch para pegar as infos do json local
  .then((response) => response.json())
  .then((data) => {
    let h3 = document.querySelector("#localizacao");
    let imagemTopo = document.querySelector("#imagem-topo");
    let imagemPrincipal = document.querySelector("#imagem-principal");
    let imagemBaixo = document.querySelector("#imagem-baixo");
    let posAtual = 0;
    function mostrarViagem() {
      const conjunto = data[posAtual];
      h3.textContent = conjunto.local;
      imagemTopo.src = conjunto.fotoTopo;
      imagemPrincipal.src = conjunto.fotoPrincipal;
      imagemBaixo.src = conjunto.fotoBaixo;
    }
    document.querySelector("#proximo").addEventListener("click", () => {
      if (posAtual >= 0 && posAtual < 3) {
        posAtual++;
      } else {
        posAtual = 0;
      }
      mostrarViagem();
    });
    document.querySelector("#anterior").addEventListener("click", () => {
      if (posAtual > 0 && posAtual <= 3) {
        posAtual--;
      } else {
        posAtual = 3;
      }
      mostrarViagem();
    });
    mostrarViagem();
  })
  .catch((err) => console.error("ERROOOOOOO", err));

fetch("./data/conhecer.json")
  .then((response) => response.json())
  .then((data) => {
    let h32 = document.querySelector("#localizacao2");
    let imagemTopo = document.querySelector("#imagem-topo2");
    let imagemPrincipal = document.querySelector("#imagem-principal2");
    let imagemBaixo = document.querySelector("#imagem-baixo2");
    let posAtual = 0;

    function mostrarViagem2() {
      const conjunto = data[posAtual];
      h32.textContent = conjunto.local;
      imagemTopo.src = conjunto.fotoTopo;
      imagemPrincipal.src = conjunto.fotoPrincipal;
      imagemBaixo.src = conjunto.fotoBaixo;
    }

    document.querySelector("#proximo2").addEventListener("click", () => {
      posAtual = (posAtual + 1) % data.length;
      mostrarViagem2();
    });

    document.querySelector("#anterior2").addEventListener("click", () => {
      posAtual = (posAtual - 1 + data.length) % data.length;
      mostrarViagem2();
    });

    mostrarViagem2();
  })
  .catch((err) => console.error("ERRO AO CARREGAR conhecer.json:", err));
