document.getElementById("search").addEventListener("click", searchCity);
document.getElementById("city-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita comportamento padrão do Enter
        searchCity();
    }
});

async function searchCity() {
    const city = document.getElementById("city-input").value.trim().toUpperCase();
    const mapElement = document.getElementById("map");

    if (!city) {
        alert("Por favor, digite o nome da cidade.");
        return;
    }

    // Função para carregar múltiplos arquivos JSON
    async function carregarDados() {
        const arquivos = [
            "dados/D.SDA.PDA.005.CAT.202409.json",
            "dados/D.SDA.PDA.005.CAT.202408.json", // Adicione mais arquivos aqui
            "dados/D.SDA.PDA.005.CAT.202407.json",
            "dados/D.SDA.PDA.005.CAT.202406.json",
            "dados/D.SDA.PDA.005.CAT.202405.json",
            "dados/D.SDA.PDA.005.CAT.202404.json",
            "dados/D.SDA.PDA.005.CAT.202403.json",
            "dados/D.SDA.PDA.005.CAT.202402.json",
            "dados/D.SDA.PDA.005.CAT.202401.json"
        ];

        try {
            // Use Promise.all para carregar todos os arquivos simultaneamente
            const respostas = await Promise.all(arquivos.map(async (arquivo) => {
                const response = await fetch(arquivo);
                if (!response.ok) {
                    throw new Error(`Erro ao carregar o arquivo: ${arquivo}`);
                }
                try {
                    return await response.json();
                } catch (jsonError) {
                    throw new Error(`Erro ao analisar JSON do arquivo: ${arquivo}`);
                }
            }));

            // Combine todos os dados de cada resposta
            const todosOsDados = respostas.flatMap(resposta => resposta.nodes || []);
            return todosOsDados;
        } catch (erro) {
            console.error("Erro ao carregar os arquivos JSON:", erro);
            return [];
        }
    }

    // Função para corrigir caracteres mal formatados
    function corrigirTexto(texto) {
        if (!texto) return "Não especificado";
        return texto.replace(/�/g, "").trim(); // Substitui caracteres estranhos e remove espaços extras
    }

    const dados = await carregarDados();
    console.log("Dados carregados:", dados);

    const registrosFiltrados = dados.filter(registro =>
        registro.node["Munic Empr"] && registro.node["Munic Empr"].toUpperCase().includes(city)
    );

    console.log("Registros filtrados:", registrosFiltrados);

    if (registrosFiltrados.length === 0) {
        mapElement.innerHTML = `<p>Nenhum dado encontrado para a cidade: ${city}</p>`;
        return;
    }

    let htmlContent = `<h3>Dados de Acidentes para ${city} - Total: ${registrosFiltrados.length}</h3><ul>`;
    registrosFiltrados.forEach(registro => {
        const dataAcidente = registro.node["Data Acidente"] || "Data não disponível";
        const sexo = corrigirTexto(registro.node["Sexo"]);
        const parteCorpoAtingida = corrigirTexto(registro.node["Parte Corpo Atingida"]);
        const origemCadastramento = corrigirTexto(registro.node["Origem de Cadastramento CAT"]);

        htmlContent += `
            <li>
                <strong>Data do Acidente:</strong> ${dataAcidente}<br>
                <strong>Sexo:</strong> ${sexo}<br>
                <strong>Parte do Corpo Atingida:</strong> ${parteCorpoAtingida}<br>
                <strong>Origem de Cadastramento CAT:</strong> ${origemCadastramento}
            </li>
        `;
    });
    htmlContent += `</ul>`;

    mapElement.innerHTML = htmlContent;
}
