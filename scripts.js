/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de medicamentos do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const listarMedicamentos = async () => {
  let url = 'http://127.0.0.1:5000//listar_medicamentos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {

      data.medicamentos.forEach(item => incluirListaMed(item.nome, item.laboratorio, item.dosagem, item.receita))
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Ocorreu um erro no serviço. Favor entrar em contato.')
    });
}

/*
  --------------------------------------------------------------------------------------
  Carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
listarMedicamentos()


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um medicamento na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputNomeMedicamento, inputLaboratorio, inputDosagem, inputReceita) => {
  const formData = new FormData();
  formData.append('nome', inputNomeMedicamento);
  formData.append('laboratorio', inputLaboratorio);
  formData.append('dosagem', inputDosagem);
  formData.append('receita', inputReceita);

  let url = 'http://127.0.0.1:5000/medicamento';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      if (response.status === 200) {
        incluirListaMed(inputNomeMedicamento, inputLaboratorio, inputDosagem, inputReceita);
        alert('Medicamento adicionado com sucesso');
      } else {
        // Tratar casos em que a resposta não tem status 200 (erro do servidor, por exemplo)
        response.json().then((data) => {
          // Exibir mensagem de erro, se disponível na resposta
          if (data && data.mensagem) {
            alert(data.mensagem);
          } else {
            alert("Erro desconhecido ao adicionar o medicamento. Favor entrar em contato.");
          }
        });
      }
    })
    .catch((error) => {
      // Tratar erros de rede ou problemas na solicitação
      alert('Ocorreu um erro no serviço. Favor entrar em contato.')
      console.log('Error: ', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para excluir uma medicação do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteMedicamento = (item) => {

  let url = 'http://127.0.0.1:5000/medicamento?nome=' + item;

  fetch(url, {
    method: 'delete'
  })
    .then((response) => {
      if (response.status === 200) {
        alert('Medicamento excluído com sucesso')
      } else {
        // Tratar casos em que a resposta não tem status 200 (erro do servidor, por exemplo)
        response.json().then((data) => {
          // Exibir mensagem de erro, se disponível na resposta
          if (data && data.mensagem) {
            alert(data.mensagem);
          } else {
            alert("Erro desconhecido ao remover o item.");
          }
        });
      }
    })
    .catch((error) => {
      // Tratar erros de rede ou problemas na solicitação
      console.log('Error: ', error)
      alert('Erro na solicitação: ' + error.message);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chame a função adicionarMedicamento quando desejar adicionar um medicamento.
  --------------------------------------------------------------------------------------
*/
const adicionarMedicamento = () => {

  // Verifica o tipo de receita
  if (typeof (document.getElementById("newReceita").value) === "undefined" ||
    typeof (document.getElementById("newReceita").value) === null) {
    alert("Tipo de receita inválida. Por favor, verifique.")
  }
  else {
    // Verifica as demais informações
    let inputNomeMedicamento = document.getElementById("newNomeMedicamento").value;
    let inputLaboratorio = document.getElementById("newLaboratorio").value;
    let inputDosagem = document.getElementById("newDosagem").value;
    let inputReceita = document.getElementById("newReceita").value;

    if (inputNomeMedicamento === '' || inputReceita === '') {
      alert("O nome do medicamento e o tipo de receita são obrigatórios para o cadastro");
    }
    else if (inputReceita != "S" && inputReceita != "N" && inputReceita != "C") {
      alert("Tipo de receita inválida. Por favor verifique.");
    } else {
      try {
        postItem(inputNomeMedicamento, inputLaboratorio, inputDosagem, inputReceita);
      } catch (error) {
        alert("Erro ao cadastrar medicamento: " + error.message);
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Chame a função incluirListaMed quando desejar incluir um medicamento na 
  lista de medicamentos.
  --------------------------------------------------------------------------------------
*/
const incluirListaMed = (nome, laboratorio, dosagem, receita) => {
  var table = document.getElementById('tab_med');
  var row = table.insertRow();

  // Adiciona a propriedade "data-medicamento" para controle da seleção da linha
  // evento click
  row.setAttribute('data-medicamento', nome);

  // Trata o tipo de receita
  if (typeof receita === 'undefined' || receita === null) {
    tipo_receita = "-"
  } else if (receita === "N") {
    tipo_receita = "Não"
  } else if (receita === "S") {
    tipo_receita = "Simples"
  } else {
    tipo_receita = "Controlada"
  }

  var item = [nome, laboratorio, dosagem, tipo_receita]

  // Gera a lista de medicamentos
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  insertButtonExclusao(row.insertCell(-1))
  configuraOpMedicamento()

  document.getElementById("newNomeMedicamento").value = "";
  document.getElementById("newLaboratorio").value = "";
  document.getElementById("newDosagem").value = "";
  document.getElementById("newReceita").value = "";

}



/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista de medicamentos
  --------------------------------------------------------------------------------------
*/
const insertButtonExclusao = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
  // Tooltip
  span.title = "Excluir medicamento";
}

/*
  --------------------------------------------------------------------------------------
  Função que define o script de operação no medicamento
  --------------------------------------------------------------------------------------
*/
const configuraOpMedicamento = () => {

  let close = document.getElementsByClassName("close");

  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Deseja realmente excluir " + nomeItem + "?")) {
        deleteMedicamento(nomeItem)
        div.remove()
      }
    }
  }

}
