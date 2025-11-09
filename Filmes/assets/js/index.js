const token ="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZmY1MzNhMDVjY2FjYWY1NDc4OTU5ZThkN2NkM2E4ZiIsIm5iZiI6MTc2MjYzNzYxOC4yMTQwMDAyLCJzdWIiOiI2OTBmYjczMjdiZTNjMDc4NmFjZTgzOWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.KIgNsBkiVDKw-z5EscjkbPKFgGa-ImAL_KfhycLG9R8";


async function pegarDataJSON() {
  const res = await fetch("./Filmes/assets/js/data.json");
  const data = await res.json();
  return data;
}

async function pegarDataAPI(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}

function montarDiv(objeto, tipo, categoria) {
  switch (tipo) {
    case "destaque": {
      document.querySelector(
        ".hero-destaques"
      ).src = `https://image.tmdb.org/t/p/original${objeto.backdrop_path}`;

      document.querySelector(
        "#destaque-texto-generos"
      ).children[0].textContent = objeto.genres.at(-1).name;

      categoria === "tv"
        ? (document.querySelector("#destaque-texto-h3").textContent =
            objeto.name)
        : (document.querySelector("#destaque-texto-h3").textContent =
            objeto.title);

      document.querySelector("#destaque-texto-overview").textContent =
        objeto.overview;
        break;
    } 
    
    case "filmes": {
        const div = document.createElement("div");
        const img = `https://image.tmdb.org/t/p/original${objeto.poster_path}`

        div.innerHTML = `<img src=${img} alt=${objeto.title}>
        <div>
        <p><i class="ri-heart-fill"></i>${String(objeto.vote_average).slice(0,3)}</p>
        <p>${objeto.release_date.slice(0, 4)}</p></div>
        <h4>${objeto.title}</h4>`

        div.classList.add("filmes-mais-vistos-card")

        document.querySelector("#filmes-mais-vistos-container").append(div)
        break;
    } 
    
    case "series": {

    }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

window.addEventListener("load", async () => {
  const json = await pegarDataJSON();
  let i = 0;

  while (true) {
    const { id, tipo } = json.destaques[i];
    const objeto = await pegarDataAPI(
      `https://api.themoviedb.org/3/${tipo}/${id}?language=pt-BR`
    );

    montarDiv(objeto, "destaque", tipo);

    await delay(3000);

    i = (i + 1) % json.destaques.length;
  }
});

async function listar(tipo) {
  const json = await pegarDataJSON();

  switch (tipo) {
    case "filmes": {
      for (const filme of json.filmes_mais_vistos) {
        const objeto = await pegarDataAPI(
          `https://api.themoviedb.org/3/${filme.tipo}/${filme.id}?language=pt-BR`
        );
        montarDiv(objeto, "filmes", filme.tipo);
      }
      break;
    }
  }
}

listar("filmes")