/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  - fetch - método que faz requisição a API do servidor local (get produtos)
  - .then - acessa a resposta da API. 
  - O método json() serve para converter a reposta da API em objeto javascript
  - forEach - array para listar todos os produtos, 
  - O forEach está chamando a função insertList a cada iteração
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);

}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão lupa para cada item da lista
  --------------------------------------------------------------------------------------
*/

const insertLupa = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u002B");
  span.className = "open";
  span.appendChild(txt);
  parent.appendChild(span);
}



/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para listar comentários de um item da lista de acordo com o click no botão open
  --------------------------------------------------------------------------------------
*/

const MostraComentario = () => {
  let open = document.getElementsByClassName("open");

  let i;
  for (i = 0; i < open.length; i++) {
    open[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      getComentario(nomeItem)
    }
  }


}


/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para consultar um comentários de um produto e apresentar na tela usado GET
  --------------------------------------------------------------------------------------
*/

const getComentario = (item) => {
  console.clear
  console.log('Item escolhido:', item)

  var tabela = document.getElementById('myTableComent');
  var tbody = tabela.getElementsByTagName('tbody')[0];
  console.log('rows: ', tbody.rows.length)
  if (tbody.rows.length > 0) {
    for (var i = 1; i < tbody.rows.length; i++) {
      tbody.deleteRow(tbody.rows.length - 1);
    }
  }
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then(data => {
      var row = tbody.insertRow();

      console.log('Nome do produto:', data.nome);
      console.log('Quantidade:', data.quantidade);
      console.log('Valor:', data.valor);
      var i = 1;
      data.comentarios.forEach(comentario => {
        var row = tbody.insertRow();
        var cellComentarios = row.insertCell();
        cellComentarios.innerText = 'texto ' + i + ' de ' + data.nome + ': ' + comentario.texto;
        console.log('texto:', comentario.texto);
        i = i + 1;
      })

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  - a variável table chama o objeto myTable do html 
  - a variavel row serve para criar mais uma linha na tabela
  - chama a função insertButton para inserir botão insertButton para deleção
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  insertLupa(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
  MostraComentario()
}



