const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmY1MzNhMDVjY2FjYWY1NDc4OTU5ZThkN2NkM2E4ZiIsIm5iZiI6MTc2MjYzNzYxOC4yMTQwMDAyLCJzdWIiOiI2OTBmYjczMjdiZTNjMDc4NmFjZTgzOWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.KIgNsBkiVDKw-z5EscjkbPKFgGa-ImAL_KfhycLG9R8";

// le o JSON local com os IDs
async function pegarDataJSON() {
  const res = await fetch("./Filmes/assets/js/data.json");
  return await res.json();
}

// consulta a api do tmdb
async function pegarDataAPI(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

// monta o card de cada categoria e tipo
function montarDiv(objeto, tipo, categoria) {
  switch (tipo) {
    case "destaque": {
      document.querySelector(
        ".hero-destaques"
      ).src = `https://image.tmdb.org/t/p/original${objeto.backdrop_path}`;
      document.querySelector("#destaque-texto-generos p").textContent =
        objeto.genres?.at(-1)?.name || "";
      document.querySelector("#destaque-texto-h3").textContent =
        categoria === "tv" ? objeto.name : objeto.title;
      document.querySelector("#destaque-texto-overview").textContent =
        objeto.tagline || objeto.overview || "";
      document.querySelector(
        "#assistir-botao"
      ).href = objeto.homepage;
      document.querySelector("#detalhes-botao").href = `Filmes/informacoes.html?id=${objeto.id}&categoria=${categoria}`
      break;
    }

    case "filmes":
    case "series":
    case "animes": {
      const div = document.createElement("div");
      div.classList.add("card");

      const titulo = categoria === "tv" ? objeto.name : objeto.title;
      const data =
        categoria === "tv" ? objeto.first_air_date : objeto.release_date;
      const imagem = `https://image.tmdb.org/t/p/w500${objeto.poster_path}`;

      div.innerHTML = `
        <a href="Filmes/informacoes.html?id=${
          objeto.id
        }&categoria=${categoria}">
          <img src="${imagem}" alt="${titulo}">
        </a>
        <div class="info">
          <div>
            <p><i class="ri-heart-fill"></i>${String(
              objeto.vote_average || 0
            ).slice(0, 3)}</p>
            <p>${data ? data.slice(0, 4) : "—"}</p>
          </div>
          <h4>${titulo}</h4>
        </div>
        <div class="trailer-container">
          <iframe allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>`;

      const iframe = div.querySelector("iframe");
      div.addEventListener("mouseenter", () => {
        const key = objeto.videos?.results?.[0]?.key;
        if (key)
          iframe.src = `https://www.youtube.com/embed/${key}?autoplay=1&controls=0&start=0&end=15&modestbranding=1&rel=0&showinfo=0`;
      });
      div.addEventListener("mouseleave", () => (iframe.src = ""));

      let destino;
      if (tipo === "filmes") {
        destino = "#filmes-mais-vistos-container";
      } else if (tipo === "series") {
        destino = "#series-mais-vistas-container";
      } else {
        destino = "#animes-mais-vistos-container";
      }

      document.querySelector(destino).append(div);
      break;
    }
  }
}

// lista os filmes/series/animes
async function listar(tipo) {
  const json = await pegarDataJSON();

  let lista;

  if (tipo === "filmes") {
    lista = json.filmes_mais_vistos;
  } else if (tipo === "series") {
    lista = json.series_mais_vistas;
  } else {
    lista = json.animes_mais_vistos;
  }

  for (let item of lista) {
    const objeto = await pegarDataAPI(
      `https://api.themoviedb.org/3/${item.tipo}/${item.id}?language=pt-BR&append_to_response=videos`
    );
    if (objeto && objeto.videos && objeto.videos.results.length > 0) {
      montarDiv(objeto, tipo, item.tipo);
    }
  }
}

// delay para os destaques
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// monta a pagina
window.addEventListener("load", async () => {
  listar("filmes");
  listar("series");
  listar("animes");
  const json = await pegarDataJSON();
  let i = 0;
  while (true) {
    const { id, tipo } = json.destaques[i];
    const objeto = await pegarDataAPI(
      `https://api.themoviedb.org/3/${tipo}/${id}?language=pt-BR&append_to_response=videos`
    );
    montarDiv(objeto, "destaque", tipo);
    await delay(4000);
    i = (i + 1) % json.destaques.length;
  }
});

// controle de carrossel
document.addEventListener("DOMContentLoaded", () => {
  const carrosseis = document.querySelectorAll(".carrossel-section");

  carrosseis.forEach((secao) => {
    const container = secao.querySelector(".carrossel-container");
    const esquerda = secao.querySelector(".esquerda");
    const direita = secao.querySelector(".direita");

    const scroll = 1200;

    esquerda.addEventListener("click", () =>
      container.scrollBy({ left: -scroll, behavior: "smooth" })
    );
    direita.addEventListener("click", () =>
      container.scrollBy({ left: scroll, behavior: "smooth" })
    );
  });
});
