import { expect, test } from "@playwright/test";

test("Should display log in", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(
    page.getByRole("heading", { name: "Inicia sesion con tu cuenta" }),
  ).toBeVisible();
  await expect(page.getByRole("heading")).toContainText(
    "Inicia sesion con tu cuenta",
  );
  await page.locator("div").filter({ hasText: /^Correo electronico$/ }).locator(
    "span",
  ).click();
  await expect(page.locator("span").nth(1)).toBeVisible();

  await expect(page.getByRole("button", { name: "Ingresar" })).toBeVisible();
  await page.getByText("No tienes cuenta? Create una").click();
  await page.getByRole("link", { name: "Create una" }).click();
});

test("Should display log in then signup", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Create una" }).click();
  await page.locator("div").filter({ hasText: "Crea una cuentaCorreo" }).nth(3)
    .click();
});

test("Should log in and show main page", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");

  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.getByRole("heading", { name: "Bienvenido a Izoe" }))
    .toBeVisible();
  await expect(page.getByRole("heading", { name: "Historias incompletas" }))
    .toBeVisible();
  await page.getByRole("heading", { name: "Evoluciones incompletas" }).click();
});

test("Should log in and show main page data", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );

  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page.getByRole("heading", { name: "Historias incompletas" }))
    .toBeVisible();
  await page.locator("#incompleteHistoryTable").getByText("Nombre").click();
  await page.locator("#incompleteHistoryTable").getByText("Cedula").click();
  await page.getByText("Primera consulta").click();
  await page.getByText("Ultima consulta").click();
  await page.getByRole("cell", { name: "kh hjcy" }).click();
  await page.getByRole("heading", { name: "Completar Historia Clinica" })
    .click();
  await expect(page.getByText("Nombre:")).toBeVisible();
  await page.getByLabel("Completar Historia Clinica").getByText("kh hjcy")
    .click();
  await page.getByLabel("Diagnostico").click();
  await page.getByLabel("Tratamiento").click();
  await expect(page.getByRole("button", { name: "Cerrar" })).toBeVisible();

  
  await page.getByRole('button', { name: 'Cerrar' }).click();

  await expect(page.locator('#root')).toContainText('Evoluciones incompletas');

  await expect(page.getByRole("button", { name: "Inicio" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pacientes" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Configuraciones" }))
    .toBeVisible();
  await expect(page.locator("#root")).toContainText("Bienvenido a Izoe");
  await expect(page.locator("#user-logout-menu")).toContainText(
    "Juan de prueba",
  );
  await expect(page.locator("#clinic-code")).toContainText("Codigo: N6MBV0");
});

test("Should log in and show Patients page", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page.getByRole("button", { name: "Inicio" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pacientes" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Configuraciones" }))
    .toBeVisible();
  await expect(page.locator("#root")).toContainText("Pacientes");
  await page.getByRole("button", { name: "Pacientes" }).click();
  await expect(
    page.locator("div").filter({ hasText: /^Pacientes$/ }).getByRole(
      "paragraph",
    ),
  ).toBeVisible();
  await expect(page.locator("#root")).toContainText("Pacientes");
  await expect(page.getByRole("tablist")).toContainText("Ver pacientes");
  await expect(page.getByRole("tablist")).toContainText("Crear paciente");
  await expect(page.getByRole("cell", { name: "Ingrese un parametro de" }))
    .toBeVisible();
  await expect(page.locator("label")).toContainText("Buscar por:");
  await expect(page.getByRole("button", { name: "Refresh" })).toBeVisible();
  await page.getByPlaceholder("Buscar paciente").click();
  await page.getByPlaceholder("Buscar paciente").fill("j");
  await expect(page.getByText("Juan Diego Venegas Barreto")).toBeVisible();
  await expect(page.getByRole("cell", { name: "1723931463" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "-11-18" })).toBeVisible();
  await expect(page.locator("tbody")).toContainText("kh hjcy");
});

test("Should log in and filter by id", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();
  await page.getByLabel("Buscar por:").selectOption("personalId");
  await page.getByPlaceholder("Buscar paciente").click();
  await page.getByPlaceholder("Buscar paciente").fill("1");
  await expect(page.locator("tbody")).toContainText("123213123123");
  await expect(page.locator("tbody")).toContainText("ew fdsf dfgdsfg");
  await expect(page.locator("tbody")).toContainText("Ver mas");
  await expect(page.getByRole("button", { name: "Ver mas" }).first())
    .toBeVisible();
});

test("Should log in and filter by dates", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.getByLabel("Buscar por:").selectOption("firstSession");
  await page.getByPlaceholder("Buscar paciente...").fill("2024-11-15");
  await expect(page.getByRole("cell", { name: "4", exact: true }).first())
    .toBeVisible();
  await page.getByLabel("Buscar por:").selectOption("lastSession");
  await page.getByPlaceholder("Buscar paciente...").fill("2024-11-29");
  await expect(page.locator("td").filter({ hasText: "123234" })).toBeVisible();
  await expect(page.locator("tbody")).toContainText("123234");
  await expect(page.locator("tbody")).toContainText("2024-11-20");
});

test("Should log in and show evolution details", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.getByLabel("Buscar por:").selectOption("name");
  await page.locator("div").filter({
    hasText:
      /^Buscar por: NombreCedulaFecha de primera consultaFecha de ultima consultaRefresh$/,
  }).locator("span").nth(2).click();
  await page.getByPlaceholder("Buscar paciente").fill("j");
  await page.getByRole("button", { name: "Ver mas" }).first().click();
  await expect(page.getByRole("heading", { name: "Cargando..." }))
    .toBeVisible();
  await page.getByLabel("Cargando...").locator("div").nth(1).click();
  await page.getByRole("button", { name: "Datos del paciente" }).click();
  await expect(page.locator(".fui-AccordionPanel")).toBeVisible();
  await page.getByRole("button", { name: "Motivo de consulta" }).click();
  await expect(
    page.locator("div").filter({
      hasText: /^Prueba de exportacion completa de formulario$/,
    }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Diagnostico" }).click();
  await expect(page.getByText("Codigo: H18.1; Descripcion:")).toBeVisible();
  await page.getByRole("button", { name: "Paraclinicos" }).click();
  await expect(page.locator("div:nth-child(12) > .fui-AccordionPanel"))
    .toBeVisible();
  await page.getByRole("button", { name: "Diagnostico variado" }).click();
  await expect(page.getByText("Diagnostico variadoSubido por")).toBeVisible();
  await page.getByRole("button", { name: "Ver Diagnostico variado" }).click();
  await expect(page.getByRole("heading", { name: "Ver Diagnostico variado" }))
    .toBeVisible();
  await expect(page.getByRole("img", { name: "-11-20T22:08:00+00:00" }))
    .toBeVisible();
  await page.getByRole("button", { name: "Cerrar" }).click();
  await page.getByRole("button", { name: "Evolucion" }).click();
  await page.getByRole("button", { name: "-11-18 - 15:39" }).click();
  await expect(page.getByText("2024-11-18 - 15:39Motivo:")).toBeVisible();
  await page.getByRole("button", { name: "Fecha de anotacion: 2024-11-" })
    .first().click();
  await expect(
    page.getByText("Fecha de anotacion: 2024-11-20igfdsg io gfdgid fsg"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cerrar" }).click();
});

test("Should log in and add evolution", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.locator("div").filter({
    hasText:
      /^Buscar por: NombreCedulaFecha de primera consultaFecha de ultima consultaRefresh$/,
  }).locator("span").nth(2).click();
  await page.getByPlaceholder("Buscar paciente").fill("j");
  await page.getByRole("button", { name: "Evolucion" }).first().click();
  await page.getByRole("button", { name: "Continuar mas tarde" }).click();
  await page.getByRole("button", { name: "Enviar para continuar mas" }).click();
  await page.locator("div").filter({
    hasText:
      /^Buscar por: NombreCedulaFecha de primera consultaFecha de ultima consultaRefresh$/,
  }).locator("span").nth(2).click();
  await page.getByPlaceholder("Buscar paciente").fill("j");
  await page.getByRole("button", { name: "Ver mas" }).first().click();
  await expect(page.getByText('Paciente: Juan Diego Venegas')).toBeVisible();

  await page.getByRole('button', { name: 'Evolucion' }).click();
  await page.getByRole('button', { name: '2024-11-30 - 22:23' }).click();
  await expect(page.getByText("2024-11-30 - 22:23Motivo:")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar" }).click();
});

test("Should log in and view export options", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.locator("div").filter({
    hasText:
      /^Buscar por: NombreCedulaFecha de primera consultaFecha de ultima consultaRefresh$/,
  }).locator("span").nth(2).click();
  await page.getByPlaceholder("Buscar paciente").fill("j");  
  await page.getByRole('button', { name: 'Exportar' }).first().click();
  await page.getByRole('menuitem', { name: 'Completo' }).click();
  await page.waitForTimeout(5000);

  await expect(page.getByRole("button", { name: "Volver" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Descargar" })).toBeVisible();
  await page.getByRole("button", { name: "Volver" }).click();
  await page.locator("div").filter({
    hasText:
      /^Buscar por: NombreCedulaFecha de primera consultaFecha de ultima consultaRefresh$/,
  }).locator("span").nth(2).click();
  await page.getByPlaceholder("Buscar paciente").fill("j");
  await page.getByRole('button', { name: 'Exportar' }).first().click();
  await page.getByText("Resumen").click();
  await page.locator("#date-from").fill("2024-11-22");
  await page.locator("#date-to").fill("2024-11-29");
  await page.getByRole("button", { name: "Buscar" }).click();
  await expect(page.locator("div").filter({ hasText: /^Buscar$/ }).nth(1))
    .toBeVisible();
  await page.getByRole("button", { name: "Volver" }).click();
});

test("Should log in and create patient", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.getByRole("tab", { name: "Crear paciente" }).click();
  await expect(page.getByLabel("", { exact: true })).toBeVisible();
  await expect(page.getByPlaceholder("Nombre del doctor")).toHaveValue(
    "Juan de prueba",
  );

  await page.getByPlaceholder("Nombre del paciente").click();
  await page.getByPlaceholder("Nombre del paciente").fill("l");
  await page.getByPlaceholder("Ingrese fecha de nacimiento").fill("2024-12-03");
  await page.getByPlaceholder("Edad del paciente").click();
  await page.getByPlaceholder("Edad del paciente").fill("5");

  await page.getByPlaceholder("Ocupacion del paciente").click();
  await page.getByPlaceholder("Ocupacion del paciente").fill("l");
  await page.getByPlaceholder("Estado civil del paciente").click();
  await page.getByPlaceholder("Estado civil del paciente").fill("l");
  await page.getByPlaceholder("Cedula del paciente").click();
  await page.getByPlaceholder("Cedula del paciente").fill("l");
  await page.getByPlaceholder("Direccion del paciente").click();
  await page.getByPlaceholder("Direccion del paciente").fill("l");
  await expect(page.getByRole("button", { name: "Terminar mas tarde" }))
    .toBeVisible();
  await page.getByPlaceholder("Numero telefonico").click();

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill("l");
  await page.getByPlaceholder("Numero Telefonico").click();
  await page.getByPlaceholder("Numero Telefonico").fill("l");
  await page.getByPlaceholder("Creencia religiosa").click();
  await page.getByPlaceholder("Creencia religiosa").fill("l");
  await page.getByPlaceholder("Describe el motivo de la").click();
  await page.getByPlaceholder("Describe el motivo de la").fill("l");
  await page.getByPlaceholder("Ingrese la enfermedad actual...").click();
  await page.getByPlaceholder("Ingrese la enfermedad actual...").fill("l");
  await page.getByPlaceholder("Antecedentes patologicos...").click();
  await page.getByPlaceholder("Antecedentes patologicos...").fill("l");
  await page.getByPlaceholder("Antecedentes farmacologicos...").click();
  await page.getByPlaceholder("Antecedentes farmacologicos...").fill("l");
  await page.getByPlaceholder("Antecedentes quirurgicos...").click();
  await page.getByPlaceholder("Antecedentes quirurgicos...").fill("l");
  await page.getByPlaceholder("Antecedentes de trauma...").click();
  await page.getByPlaceholder("Antecedentes de trauma...").fill("l");
  await page.getByPlaceholder("Antecedentes alergicos...").click();
  await page.getByPlaceholder("Antecedentes alergicos...").fill("l");
  await page.getByPlaceholder("Antecedentes toxicos...").click();
  await page.getByPlaceholder("Antecedentes toxicos...").fill("l");
  await page.getByPlaceholder("Antecedentes hospitalarios...").click();
  await page.getByPlaceholder("Antecedentes hospitalarios...").fill("l");
  await page.getByLabel("Es gineco-obstetrico?").check();
  await expect(page.locator("#root")).toContainText("Gineco-Obstetrico");
  await page.getByLabel("Es gineco-obstetrico?").uncheck();
  await page.getByPlaceholder("Ingrese los antecedentes").click();
  await page.getByPlaceholder("Ingrese los antecedentes").fill("l");
  await page.getByPlaceholder("Ingrese revision de piel y").click();
  await page.getByPlaceholder("Ingrese revision de piel y").fill("l");
  await page.getByPlaceholder("Ingrese revision del sistema genitourinario")
    .click();
  await page.getByPlaceholder("Ingrese revision del sistema genitourinario")
    .fill("l");
  await page.getByPlaceholder("Ingrese revision de colageno").click();
  await page.getByPlaceholder("Ingrese revision de colageno").fill("l");
  await page.getByPlaceholder("Ingrese revision del sistema musculoesqueletico")
    .click();
  await page.getByPlaceholder("Ingrese revision del sistema linfatico").click();
  await page.getByPlaceholder("Ingrese revision del sistema linfatico").fill(
    "l",
  );
  await page.getByPlaceholder("Ingrese revision de alimentacion").click();
  await page.getByPlaceholder("Ingrese revision de alimentacion").fill("l");
  await page.getByPlaceholder("Ingrese revision del sistema cardiaco").click();
  await page.getByPlaceholder("Ingrese revision del sistema cardiaco").fill(
    "l",
  );
  await page.getByPlaceholder("Ingrese revision del sueño").click();
  await page.getByPlaceholder("Ingrese revision del sueño").fill("l");
  await page.getByPlaceholder("Ingrese revision del sitema").click();
  await page.getByPlaceholder("Ingrese revision del sitema").fill("l");
  await page.getByPlaceholder("Ingrese revision de la").click();
  await page.getByPlaceholder("Ingrese revision de la").fill("l");
  await page.getByPlaceholder("Ingrese revision del sistema respiratorio")
    .click();
  await page.getByPlaceholder("Ingrese revision del sistema respiratorio").fill(
    "l",
  );
  await page.getByPlaceholder("Ingrese revision psicosocial").click();
  await page.getByPlaceholder("Ingrese revision psicosocial").fill("l");
  await page.getByPlaceholder("Ingrese revision del sistema digestivo").click();
  await page.getByPlaceholder("Ingrese revision del sistema digestivo").fill(
    "l",
  );
  await page.getByPlaceholder("Ingrese revision de sentidos").click();
  await page.getByPlaceholder("Ingrese revision de sentidos").fill("l");
  await page.getByPlaceholder("Ingrese revision del sistema sanguineo").click();
  await page.getByPlaceholder("Ingrese revision del sistema sanguineo").fill(
    "l",
  );
  await page.getByPlaceholder("Familiograma").click();
  await page.getByPlaceholder("Familiograma").fill("l");
  await page.getByPlaceholder("Frecuencia cardiaca").click();
  await page.getByPlaceholder("Frecuencia cardiaca").fill("05");
  await page.getByPlaceholder("Frecuencia respiratoria").click();
  await page.getByPlaceholder("Frecuencia respiratoria").fill("05");
  await page.getByPlaceholder("Tension arterial").click();
  await page.getByPlaceholder("Tension arterial").fill("5");
  await page.getByPlaceholder("Saturacion").click();
  await page.getByPlaceholder("Saturacion").fill("05");
  await page.getByPlaceholder("Temperatura").click();
  await page.getByPlaceholder("Temperatura").fill("05");
  await page.getByPlaceholder("Peso").click();
  await page.getByPlaceholder("Peso").fill("05");
  await page.getByPlaceholder("Talla").click();
  await page.getByPlaceholder("Talla").fill("05");
  await page.getByPlaceholder("IMC").click();
  await page.getByPlaceholder("Ingrese el examen fisico...").click();
  await page.getByRole("button", { name: "Agregar diagnostico" }).click();
  await expect(page.getByPlaceholder("Ingrese el diagnostico..."))
    .toBeVisible();
  await page.getByPlaceholder("Ingrese el diagnostico...").click();
  await page.getByPlaceholder("Ingrese el diagnostico...").click();
  await page.getByPlaceholder("Ingrese el diagnostico...").fill("gripa");

  await expect(page.getByPlaceholder("Ingrese el diagnostico...")).toHaveValue(
    "gripa",
  );
  await page.getByRole("button", { name: "CIE10" }).click();
  await page.getByText("Obteniendo códigos").click();
  await page.getByPlaceholder("Código CIE10").click();
  await page.getByPlaceholder("Código CIE10").fill("a");
  await page.getByRole("button", { name: "Agregar tratamiento" }).click();
  await expect(page.getByPlaceholder("Ingrese el tratamiento..."))
    .toBeVisible();
  await page.getByPlaceholder("Ingrese el tratamiento...").click();
  await page.getByPlaceholder("Ingrese el tratamiento...").fill("a");
  await expect(page.getByPlaceholder("Nombre del paciente")).toHaveValue("l");
  await expect(page.getByPlaceholder("Ingrese fecha de nacimiento"))
    .toHaveValue("2024-12-03");
  await expect(page.getByPlaceholder("Edad del paciente")).toHaveValue("5");
  await expect(page.getByPlaceholder("Ingrese el diagnostico...")).toHaveValue(
    "gripa",
  );
  await page.getByPlaceholder("Familiograma").click();
  await page.getByPlaceholder("Familiograma").fill("a");

  await page.getByPlaceholder("Ingrese el examen Fisico...").click();
  await page.getByPlaceholder("Ingrese el examen Fisico...").fill("a");

  await page.getByPlaceholder("Ingrese revision del sistema musculoesqueletico").click();
  await page.getByPlaceholder("Ingrese revision del sistema musculoesqueletico").fill("a");

  await page.getByPlaceholder("Familiograma").fill("a");

  await expect(page.getByRole("button", { name: "Guardar" })).toBeVisible();
  await page.getByRole("button", { name: "Guardar" }).click();

  await page.getByRole("button", { name: "Cancelar" }).click();
  await page.getByText("Guardar").click();
  await page.getByRole("button", { name: "Enviar" }).click();
});

test("Should log in and create patient to send later", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.getByRole("tab", { name: "Crear paciente" }).click();
  await page.getByPlaceholder("Nombre del paciente").click();
  await page.getByPlaceholder("Nombre del paciente").fill("mandar mas tarde");

  await page.getByPlaceholder("Cedula del paciente").click();
  await page.getByPlaceholder("Cedula del paciente").fill("1723931463");


  await page.getByRole('button', { name: 'Terminar mas tarde' }).click();
  await page.getByRole('button', { name: 'Cancelar' }).click();


  
  await expect(page.getByPlaceholder("Nombre del paciente")).toHaveValue(
    "mandar mas tarde",
  );
  await expect(page.getByPlaceholder("Cedula del paciente")).toHaveValue(
    "1723931463",
  );

  await expect(page.getByRole("button", { name: "Terminar mas tarde" }))
    .toBeVisible();
  await page.getByRole("button", { name: "Terminar mas tarde" }).click();
  await expect(page.getByLabel("Confirmacion para continuar")).toContainText(
    "¿Estás seguro de que deseas guardar la historia y continuar más tarde? Esto solo se puede hacer una vez y solo podras modificar los campos que no hayan sido llenados",
  );
  await expect(page.getByRole("button", { name: "Enviar para continuar mas" }))
    .toBeVisible();
  await page.getByRole("button", { name: "Enviar para continuar mas" }).click();

  await page.locator("div").filter({
    hasText:
      /^Buscar por: NombreCedulaFecha de primera consultaFecha de ultima consultaRefresh$/,
  }).locator("span").nth(2).click();
  await page.getByPlaceholder("Buscar paciente").fill("m");
  await expect(page.locator("tbody")).toContainText("mandar mas tarde");
  await page.getByRole("button", { name: "Ver mas" }).first().click();
  await page.getByRole("button", { name: "Datos del paciente" }).click();
  await expect(page.getByLabel("Paciente: mandar mas")).toContainText(
    "mandar mas tarde",
  );
  await expect(page.getByLabel("Paciente: mandar mas")).toContainText(
    "1713291463",
  );
  await page.getByRole("button", { name: "Cerrar" }).click();
});

test("Should log in and view send later patients", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.getByRole("tab", { name: "Pendientes (0)" }).click();
  await expect(page.locator("#root")).toContainText("Historias incompletas");
  await expect(
    page.locator("#incompleteHistoryTable").getByRole("cell", {
      name: "Nombre",
    }),
  ).toBeVisible();
  await expect(page.locator("#root")).toContainText("Evoluciones incompletas");
});

test("Should log in and view settings", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByPlaceholder("Correo electronico").click();
  await page.getByPlaceholder("Correo electronico").fill(
    "juanvenegasb@hotmail.com",
  );
  await page.getByPlaceholder("Contraseña").click();
  await page.getByPlaceholder("Contraseña").fill("123456789");
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.getByRole("button", { name: "Pacientes" }).click();

  await page.getByRole("button", { name: "Configuraciones" }).click();

  await expect(page.locator("#root")).toContainText("Configuraciones");
  await expect(page.locator("#root")).toContainText("Tema");
  await expect(page.locator("#root")).toContainText("Editar datos de usuario");
  await expect(page.getByText("TemaModo claro")).toBeVisible();
  await expect(
    page.getByText(
      "Editar datos de usuarioNombreNumero de telefonoEnviarCambiar contraseñaContrase",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Solicitud de ingresoRecargarUsuarioFecha de solicitudEstadoAccionesPatricio",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Editar datos de consultorioNombre del consultorioDireccionNumero de",
    ),
  ).toBeVisible();
  await expect(page.locator("#root")).toContainText("Nombre del consultorio");
  await expect(page.getByPlaceholder("Ingrese el nombre del")).toHaveValue(
    "Izoe",
  );
});

test("Should create a patient", async ({ page }) => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Create una' }).click();
  await expect(page.getByRole('heading')).toContainText('Crea una cuenta');
  await page.getByPlaceholder('Correo Eletronico').fill(uniqueEmail);

  await page.locator('div:nth-child(2) > div > .fui-Input').click();
  await page.getByPlaceholder('Ingrese el nombre').fill('n');

  await page.getByPlaceholder('Numero telefonico').fill('p');
  await page.getByPlaceholder('Ingrese la contraseña').fill('123456789');
  await page.getByPlaceholder('Repetir la contraseña').fill('123456789');

  await page.getByRole('button', { name: 'Ingresar' }).click();

  await page.getByPlaceholder('Nombre de la compañia').click();
  await page.getByPlaceholder('Nombre de la compañia').fill('a');
  await page.getByPlaceholder('Numero de telefono').click();
  await page.getByPlaceholder('Numero de telefono').fill('a');

  await page.getByPlaceholder('Ingrese la direccion: ').click();
  await page.getByPlaceholder('Ingrese la direccion: ').fill('a');
  await page.getByPlaceholder('Ingrese la breve descripcion: ').click();
  await page.getByPlaceholder('Ingrese la breve descripcion: ').fill('a');

  await page.getByRole('button', { name: 'Crear Empresa' }).click();
  await expect(page.locator('#root')).toContainText('Bienvenido a a');
  await expect(page.locator('#root')).toContainText('Bienvenido');
});