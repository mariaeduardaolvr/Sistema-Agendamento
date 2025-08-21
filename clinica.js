document.addEventListener("DOMContentLoaded", () => {

    const tabelaBody = document.getElementById("tabela-body");
    const tabelaHistoricoBody = document.getElementById("tabela-historico-body");
    const btnAdicionar = document.getElementById("adicionar-linha");
    const btnSalvar = document.getElementById("salvar-dados");
    const btnLimpar = document.getElementById("limpar-tabela");
    const toggleHistoricoBtn = document.getElementById("toggle-historico");
    const tabelaHistorico = document.getElementById("tabela-historico");
    const historicoHeader = tabelaHistorico.previousElementSibling;

    tabelaHistorico.style.display = "none";
    historicoHeader.style.display = "none";

    function criarLinha(tbody, nome="", data="", pagamento="", status="", deletavel=true){
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="text" value="${nome}" placeholder="Nome do paciente"></td>
            <td><input type="date" value="${data}"></td>
            <td>
                <select>
                    <option value="">Selecione</option>
                    <option value="dinheiro" ${pagamento==="dinheiro"?"selected":""}>Dinheiro</option>
                    <option value="cartao" ${pagamento==="cartao"?"selected":""}>Cartão</option>
                    <option value="pix" ${pagamento==="pix"?"selected":""}>PIX</option>
                </select>
            </td>
            <td>
                <select class="status-select">
                    <option value="">Selecione</option>
                    <option value="agendado" ${status==="agendado"?"selected":""}>Agendado</option>
                    <option value="compareceu" ${status==="compareceu"?"selected":""}>Compareceu</option>
                    <option value="faltou" ${status==="faltou"?"selected":""}>Faltou</option>
                </select>
            </td>
            ${deletavel?`<td><button class="btn-deletar">🗑️</button></td>`:`<td></td>`}
        `;
        if(deletavel){
            tr.querySelector(".btn-deletar").addEventListener("click",()=>tr.remove());
        }
        tbody.appendChild(tr);

        // Atualiza cor do status ao mudar
        if(status){
            tr.querySelector(".status-select").parentElement.setAttribute("data-status", status);
        }
        tr.querySelector(".status-select").addEventListener("change", e=>{
            const valor = e.target.value;
            e.target.parentElement.setAttribute("data-status", valor);
        });
    }

    function carregarLinhas() {
        const dadosSalvos = JSON.parse(localStorage.getItem("agendamentos"))||[];
        tabelaBody.innerHTML = "";
        const totalLinhas = Math.max(15, dadosSalvos.length);
        for(let i=0;i<totalLinhas;i++){
            if(dadosSalvos[i]){
                criarLinha(tabelaBody, dadosSalvos[i].nome, dadosSalvos[i].data, dadosSalvos[i].pagamento, dadosSalvos[i].status);
            } else {
                criarLinha(tabelaBody);
            }
        }
    }

    function atualizarHistorico(){
        tabelaHistoricoBody.innerHTML="";
        const historico = JSON.parse(localStorage.getItem("historicoPacientes"))||[];
        historico.forEach(dado=>criarLinha(tabelaHistoricoBody,dado.nome,dado.data,dado.pagamento,dado.status,false));
    }

    // Inicializa
    carregarLinhas();
    atualizarHistorico();

    btnAdicionar.addEventListener("click",()=>criarLinha(tabelaBody));

    btnSalvar.addEventListener("click",()=>{
        const linhas = tabelaBody.querySelectorAll("tr");
        const dados = [];
        linhas.forEach(linha=>{
            const nome = linha.querySelector("input[type='text']").value;
            const data = linha.querySelector("input[type='date']").value;
            const pagamento = linha.querySelector("select:not(.status-select)").value;
            const status = linha.querySelector(".status-select").value;
            if(nome||data||pagamento||status) dados.push({nome,data,pagamento,status});
        });
        localStorage.setItem("agendamentos", JSON.stringify(dados));
        alert("Dados salvos com sucesso!");
    });

    btnLimpar.addEventListener("click",()=>{
        const linhas = tabelaBody.querySelectorAll("tr");
        if(linhas.length===0) return alert("A tabela já está vazia.");
        if(!confirm("Deseja limpar a tabela? Linhas preenchidas irão para o histórico.")) return;

        const historicoAtual = JSON.parse(localStorage.getItem("historicoPacientes"))||[];
        const dadosAtuais = [];

        linhas.forEach(linha=>{
            const nome = linha.querySelector("input[type='text']").value;
            const data = linha.querySelector("input[type='date']").value;
            const pagamento = linha.querySelector("select:not(.status-select)").value;
            const status = linha.querySelector(".status-select").value;
            if(nome||data||pagamento||status) dadosAtuais.push({nome,data,pagamento,status});
        });

        if(dadosAtuais.length>0){
            localStorage.setItem("historicoPacientes", JSON.stringify([...historicoAtual,...dadosAtuais]));
        }

        localStorage.removeItem("agendamentos");
        carregarLinhas();
        atualizarHistorico();
        alert("Tabela limpa! Linhas preenchidas foram enviadas ao histórico.");
    });

    toggleHistoricoBtn.addEventListener("click",()=>{
        if(tabelaHistorico.style.display==="none"){
            tabelaHistorico.style.display="table";
            historicoHeader.style.display="block";
            toggleHistoricoBtn.textContent="👁️ Esconder Histórico";
        }else{
            tabelaHistorico.style.display="none";
            historicoHeader.style.display="none";
            toggleHistoricoBtn.textContent="👁️ Mostrar Histórico";
        }
    });

});





