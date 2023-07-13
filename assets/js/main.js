//datos del usuario
let input = document.querySelector('input');
let value_money = document.getElementById('value_money');
let select = document.querySelector('select');
let div_graph = document.getElementById('div_graph');

//Este arreglo se utilizará para almacenar los valores de las diferentes monedas obtenidos de una fuente externa
let list_money = [["uf"],["dolar"],["euro"],["utm"],["bitcoin"]];

// Se define una función asíncrona getMoneyChanges() para obtener los valores de las diferentes monedas desde una API externa (https://mindicador.cl/api).
async function getMoneyChanges() {
    try {
        //Se realiza una solicitud HTTP (fetch) a la API y se espera la respuesta (await).
        const res = await fetch("https://mindicador.cl/api");
        
        //Luego, se convierte la respuesta en formato JSON (await res.json()) y se extraen los valores de las diferentes monedas.
        const data = await res.json();
        //Los valores se agregan al arreglo list_money en las posiciones correspondientes.

        list_money[0].push(Number(data.uf.valor));
        list_money[1].push(Number(data.dolar.valor));
        list_money[2].push(Number(data.euro.valor));
        list_money[3].push(Number(data.utm.valor));
        list_money[4].push(Number(data.bitcoin.valor));
    } catch(e) {

        //Si ocurre algún error durante el proceso, se muestra una alerta con el mensaje de error.
        alert(e.message);
    }
    
}
//Se invoca la función getMoneyChanges() para obtener los valores de las monedas cuando se carga la página.
getMoneyChanges();


//Se inicializa la variable text con una cadena de texto que representa la opción por defecto de la lista desplegable.
//Esta opción se mostrará al usuario como "Seleccione moneda" en la lista desplegable.

let text = `<option value = "Seleccione moneda" class="text-center">Seleccione moneda</option>`;

//Se itera sobre las monedas en list_money usando un bucle for.
//Se agregan opciones adicionales a la variable text para cada moneda en la lista.
//Cada opción incluye el nombre de la moneda y se asume que su posición en list_money coincide con su posición en el bucle.

for (i=1; i<=5; i++) {
    text += `<option value = ${i-1} class="text-center">${list_money[i-1]}</option>`;
}
//Se establece el contenido HTML del elemento select con el valor de text.
//Esto inserta las opciones generadas en el paso anterior en la lista desplegable.

select.innerHTML = text;


//Se define la función moneyConvert() que se ejecuta cuando se realiza una conversión de moneda.
//Verifica si se ha seleccionado una moneda válida en la lista desplegable.
//Calcula el valor convertido de acuerdo con la moneda seleccionada y el valor de entrada proporcionado por el usuario.
//Actualiza el contenido del elemento value_money con el resultado de la conversión.
//Actualiza el contenido del elemento div_graph con un elemento de lienzo (<canvas>) para mostrar el gráfico.
function moneyConvert() {
    if (select.value == "Seleccione moneda") {
        value_money.innerHTML = "...";
    } else {
        value_money.innerHTML = Number(input.value/list_money[select.value][1]).toFixed(2) + "..." + list_money[select.value][0];
    }
    div_graph.innerHTML = `<canvas id="myChart"></canvas>`;
    getMoneyDays();    
}
//Se inicializan las variables data2_ten y data2_days como arreglos vacíos.
//Estas variables se utilizarán para almacenar los datos necesarios para generar el gráfico.
let data2_ten = [];
let data2_days = [];


//Se define la función asíncrona getMoneyDays() para obtener los datos históricos de una moneda específica.
//Se realiza una solicitud HTTP a una API externa utilizando el valor de la moneda seleccionada en la lista desplegable.
//Se espera la respuesta y se convierte en formato JSON.
//Luego, se extraen los valores y las fechas correspondientes de los datos históricos y se agregan a los arreglos data2_ten y data2_days, respectivamente.
//Finalmente, se invoca la función renderGraph() para mostrar el gráfico.
async function getMoneyDays() {
    try {
        const res2 = await fetch("https://mindicador.cl/api/"+list_money[select.value][0]);
        const data2 = await res2.json();
    
        for (i=1 ; i<=10; i++) {
            data2_ten.push(Number(data2.serie[i-1].valor));
            data2_days.push(data2.serie[i-1].fecha.split("T")[0].replace("2023-",""));
        }
    
        renderGraph();
    } catch(e) {
        alert(e.message);
    }    
}

//Se define la función renderGraph() para generar y mostrar el gráfico utilizando los datos almacenados en data2_ten y data2_days.
//Se selecciona el elemento myChart en el documento HTML.
//Se crea una nueva instancia del objeto Chart de la biblioteca Chart.js, pasando el elemento myChart, el tipo de gráfico, las etiquetas y los valores necesarios.
//Se configuran las opciones del gráfico, como las escalas en el eje Y.
//Luego, se vacían los arreglos data2_ten y data2_days para prepararlos para la siguiente actualización del gráfico.

function renderGraph() {
    const myChart = document.getElementById('myChart');
    new Chart(myChart, {
        type: 'line',
        data: {
            labels: data2_days.reverse(),
            datasets: [{
                label: 'Historial últimos 10 días',
                data: data2_ten.reverse(),
                borderWidth: 2
                }]
            },
        options: {
            scales: {
                y: {
                beginAtZero: false
                }
                }
            }
        })
    data2_ten = [];
    data2_days = [];
}