export async function generarCodigoSistema(genero_, prisma) {
  const query_response = await prisma.aspirantes.findMany({
    where: {
      genero: genero_,
    },
    select: {
      genero: true,
      fact_aspirantes: {
        select: {
          genero_grupo: true,
          grupo: true,
          fecha_actualizacion: true,
          codigo_sistema: true,
        },
      },
    },
  });

  let codig_nuevo = {};
  if (query_response.length === 0) {
    codig_nuevo["codigo_sistema"] = `${genero_.charAt(0).toUpperCase()}-1`;
    codig_nuevo["grupo"] = 1;
    codig_nuevo["genero_grupo"] = genero_;
    return codig_nuevo;
  }

  // Buscar el aspirante por genero y obtener el ultimo codigo

  const lastAspirante =
    query_response[query_response.length - 1].fact_aspirantes[0];
  // console.log(lastAspirante);
  // return;

  let prefijo = genero_.charAt(0).toUpperCase();
  let numero = parseInt(lastAspirante.codigo_sistema.split("-")[1]);

  if (lastAspirante.length != 0) {
    if (numero == 20) {
      codig_nuevo["codigo_sistema"] = `${prefijo}-${String(1)}`;
      codig_nuevo["grupo"] = lastAspirante.grupo + 1;
      codig_nuevo["genero_grupo"] = genero_;

      return codig_nuevo;
    } else {
      codig_nuevo["codigo_sistema"] = `${prefijo}-${String(numero + 1)}`;
      codig_nuevo["grupo"] = lastAspirante.grupo;
      codig_nuevo["genero_grupo"] = genero_;
      return codig_nuevo;
    }
  }
}
