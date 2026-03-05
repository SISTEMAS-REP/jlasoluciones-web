<?php

session_start();

 

// Contraseña predefinida

$correct_password = "live26";

 

// Verificar si el formulario fue enviado

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $password = $_POST["password"];

 

    // Validar contraseña

    if ($password === $correct_password) {

        $_SESSION["authenticated"] = true; // Iniciar sesión autenticada

        header("Location: index.html"); // Redirigir al contenido original

        exit;

    } else {

        $error = "Contraseña incorrecta. Inténtalo de nuevo.";

    }

}

 

// Si ya está autenticado, redirige directamente al contenido original

if (isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] === true) {

    header("Location: index.html");

    exit;

}

?>

 

<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Acceso Restringido</title>

    <style>

        /* Estilo global */

        body {

            font-family: Arial, sans-serif;

            background-color: #f4f4f4;

            display: flex;

            justify-content: center;

            align-items: center;

            height: 100vh;

            margin: 0;

            padding: 20px;

        }

 

        .login-container {

            background: white;

            border-radius: 8px;

            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

            padding: 25px;

            text-align: center;

            max-width: 400px;

            width: 100%;

        }

 

        .login-container h1 {

            font-size: 26px;

            margin-bottom: 20px;

            color: #333;

        }

 

        .input-group {

            display: flex;

            align-items: center;

            border: 1px solid #ddd;

            border-radius: 5px;

            overflow: hidden;

            margin-bottom: 20px;

        }

 

        /* Estilo del campo de entrada */

        .input-group input[type="password"],

        .input-group input[type="text"] {

            flex: 1;

            padding: 10px;

            border: none;

            font-size: 16px;

            outline: none;

        }

 

        .input-group input:focus {

            box-shadow: none;

        }

 

        /* Estilo del checkbox al costado */

        .input-group .toggle-password {

            width: 40px;

            height: 40px;

            background-color: #f4f4f4;

            display: flex;

            align-items: center;

            justify-content: center;

            cursor: pointer;

            border-left: 1px solid #ddd;

        }

 

        .input-group .toggle-password input {

            width: 20px;

            height: 20px;

            cursor: pointer;

        }

 

        .login-container button {

            width: 100%;

            padding: 15px;

            margin-top: 10px;

            background-color: #007bff;

            color: white;

            border: none;

            border-radius: 5px;

            font-size: 18px;

            cursor: pointer;

        }

 

        .login-container button:hover {

            background-color: #0056b3;

        }

 

        .error {

            color: red;

            margin-top: 10px;

        }

 

        /* Responsividad para pantallas pequeñas */

        @media (max-width: 480px) {

            .login-container h1 {

                font-size: 22px;

            }

 

            .login-container button {

                font-size: 16px;

            }

        }

    </style>

</head>

<body>

    <div class="login-container">

        <h1>Acceso Restringido</h1>

        <form method="POST">

            <!-- Input con checkbox al costado -->

            <div class="input-group">

                <input type="password" placeholder="Introduce tu contraseña" id="password" name="password" required>

                <div class="toggle-password">

                    <input type="checkbox" id="toggle-checkbox">

                </div>

            </div>

            <button type="submit">Ingresar</button>

        </form>

        <?php if (isset($error)): ?>

            <div class="error"><?php echo $error; ?></div>

        <?php endif; ?>

    </div>

 

    <script>

        // Lógica para alternar contraseña visible/invisible

        document.getElementById("toggle-checkbox").addEventListener("change", function() {

            const passwordField = document.getElementById("password");

            passwordField.type = this.checked ? "text" : "password"; // Alternar entre texto y contraseña

        });

    </script>

</body>

</html>
