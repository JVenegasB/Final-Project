import { expect, test } from "@playwright/test";

test.describe("Log In", () => {
  test("Should have fields and navigation", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await expect(page).toHaveTitle("HistoryManager");
    await expect(page.getByRole("heading", {
      name: "Inicia sesion con tu cuenta",
    })).toBeVisible();

    const emailInput = page.locator("#email-address");
    await expect(emailInput).toBeVisible();
    const validEmail = "test@email.com";
    await emailInput.fill(validEmail);
    await expect(emailInput).toHaveValue(validEmail);

    const passwordInput = page.locator("#password");
    await expect(passwordInput).toBeVisible();
    const micButton = page.locator("#togglePasswordVisibility");
    await expect(micButton).toBeVisible();

    const validPassword = "12345678";
    await passwordInput.fill(validPassword);
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(passwordInput).toHaveValue(validPassword);

    await micButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await micButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();

    const createAccountLink = page.getByRole("link", { name: "Create una" });
    await expect(createAccountLink).toBeVisible();
    await expect(createAccountLink).toHaveAttribute("href", "/signup");
    await createAccountLink.click();

    await expect(page).toHaveURL("http://localhost:5173/signup");



  });
  test("Should log in", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    const emailInput = page.locator("#email-address");
    await emailInput.fill("juanvenegasb@hotmail.com");
    const passWordInput = page.locator("#password");
    await passWordInput.fill("123456789");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page).toHaveURL("http://localhost:5173/mainPage");
  });
});

test.describe("Sign Up", () => {
  test("Should have fields on sign up page", async ({ page }) => {
    await page.goto("http://localhost:5173/signup");

    await expect(page).toHaveTitle("HistoryManager");
    await expect(page.getByRole("heading", {
      name: "Crea una cuenta",
    })).toBeVisible();

    const emailInput = page.locator("#email-address");
    await expect(emailInput).toBeVisible();
    const validEmail = "test@mail.com";
    await emailInput.fill(validEmail);
    await expect(emailInput).toHaveValue(validEmail);

    const ingresarButton = page.getByRole("button", { name: "Ingresar" });
    await expect(ingresarButton).toBeDisabled();

    const nameInput = page.locator("#name");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Test Name");
    await expect(nameInput).toHaveValue("Test Name");

    const phoneInput = page.locator("#phone");
    await expect(phoneInput).toBeVisible();
    await phoneInput.fill("12345678");
    await expect(phoneInput).toHaveValue("12345678");

    const passwordInput = page.locator("#password");
    const repeatPasswordInput = page.locator("#repeatPassword");
    await expect(passwordInput).toBeVisible();
    await expect(repeatPasswordInput).toBeVisible();

    const unvalidPassword = "123";
    await passwordInput.fill(unvalidPassword);
    const errorPassword = page.locator("#errorMessage");
    await expect(errorPassword).toBeVisible();
    await expect(errorPassword).toHaveText(
      "La contraseña debe tener al menos 8 caracteres",
    );

    const validPassword = "123456789";
    await passwordInput.fill(validPassword);
    await expect(passwordInput).toHaveValue(validPassword);
    await expect(errorPassword).not.toBeVisible();

    const unvalidRepeatPassword = "123";
    await repeatPasswordInput.fill(unvalidRepeatPassword);
    const errorRepeatPassword = page.locator("#repeatErrorMessage");
    await expect(errorRepeatPassword).toBeVisible();
    await expect(errorRepeatPassword).toHaveText(
      "Las contraseñas no coinciden",
    );

    const validRepeatPassword = "123456789";
    await repeatPasswordInput.fill(validRepeatPassword);
    await expect(repeatPasswordInput).toHaveValue(validRepeatPassword);
    await expect(errorRepeatPassword).not.toBeVisible();

    await expect(ingresarButton).toBeEnabled();

    const logIntoAccount = page.getByRole("link", { name: "Inicia sesión" });
    await expect(logIntoAccount).toBeVisible();
    await expect(logIntoAccount).toHaveAttribute("href", "/");
    await logIntoAccount.click();

    await expect(page).toHaveURL("http://localhost:5173/");
  });
});

test.describe("Authenticated User Tests", () => {
  test("should allow navigation to protected routes when logged in", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    const emailInput = page.locator("#email-address");
    await emailInput.fill("juanvenegasb@hotmail.com");
    const passWordInput = page.locator("#password");
    await passWordInput.fill("123456789");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page).toHaveURL("http://localhost:5173/mainPage");

    await expect(page.getByRole("heading", {
      name: "Bienvenido a Izoe",
    })).toBeVisible();

    const missingHistoriesTable = page.locator("#incompleteHistoryTable");
    await expect(missingHistoriesTable).toBeVisible();

    const spinner = missingHistoriesTable.locator("text=Spinner");
    const emptyMessage = missingHistoriesTable.locator(
      "text=No hay historias pendientes",
    );
    const rows = missingHistoriesTable.locator("tbody tr");

    // Handle different table states
    if (await spinner.isVisible()) {
      console.log("Table is still loading...");
    } else if (await emptyMessage.isVisible()) {
      console.log("Table is empty.");
      await expect(emptyMessage).toBeVisible();
    } else {
      // Validate rows exist
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);

      // Optionally validate first row content
      await expect(rows.first()).toContainText("Nombre");
    }

    const Code = page.locator("#clinic-code");
    await expect(Code).toBeVisible();

    const logOutMenu = page.locator("#user-logout-menu");
    await expect(logOutMenu).toBeVisible();
    await logOutMenu.click();

    const logOutButton = page.locator("#logoutButton");
    await expect(logOutButton).toBeVisible();
    await page.click("body");
    await expect(logOutButton).not.toBeVisible();

    const incompleteEvolutionTable = page.locator("#incompleteEvolutionTable");
    await expect(incompleteEvolutionTable).toBeVisible();

    const spinnerEv = incompleteEvolutionTable.locator("text=Spinner");
    const emptyMessageEv = incompleteEvolutionTable.locator(
      "text=No hay evoluciones pendientes",
    );
    const rowsEv = incompleteEvolutionTable.locator("tbody tr");

    if (await spinnerEv.isVisible()) {
      console.log("Table is still loading...");
    } else if (await emptyMessageEv.isVisible()) {
      console.log("Table is empty.");
      await expect(emptyMessageEv).toBeVisible();
    } else {
      const rowCount = await rowsEv.count();
      expect(rowCount).toBeGreaterThan(0);

      await expect(rowsEv.first()).toContainText("No hay evoluciones pendientes");
    }
    await expect(rows.first()).toContainText('kh hjcy')
  });
});
