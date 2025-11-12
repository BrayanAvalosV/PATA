// backend/src/utils/rut.js
export function limpiarRut(rut) {
  return (rut || "").replace(/\./g, "").replace(/-/g, "").trim().toUpperCase();
}

// valida con dígito verificador
export function validarRut(rut) {
  const r = limpiarRut(rut);
  if (r.length < 8) return false;
  const cuerpo = r.slice(0, -1);
  let dv = r.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0, mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const res = 11 - (suma % 11);
  const dvCalc = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return dvCalc === dv.toUpperCase();
}
