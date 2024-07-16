function intersectArrays(arr1, arr2) {
    // implementar la función

    // Debemos comprobar si cada número del array arr1 existe dentro del arr2
    // Podemos filtrar este array mirando si cada uno de los elementos del arr1 esta incluido en el arr2
    return arr1.filter(v => arr2.includes(v));

    // return 
}

// Exportar la función correctamente
module.exports = intersectArrays;