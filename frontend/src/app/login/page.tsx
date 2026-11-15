"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (result.success) {
      router.push("/");
    } else {
      setErrorMessage(result.message || "Credenciales incorrectas");
    }
  };

  // Carga automática de credenciales de prueba preconfiguradas en la base de datos
  const handleFillTestCredentials = () => {
    setEmail("cliente@utem.cl");
    setPassword("Password123!");
    setErrorMessage("");
  };

  return (
    <div className={`container ${styles.loginContainer}`}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.subtitle}>Ingresa a tu cuenta de NexusHardware</p>
        </div>

        {errorMessage && (
          <div className={styles.errorAlert}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Caja de ayuda para evaluación académica */}
        <div className={styles.testCredentialsBox}>
          <div className={styles.testCredentialsHeader}>
            <span>⚡ Cuenta de Prueba (Seed):</span>
            <button
              type="button"
              onClick={handleFillTestCredentials}
              className={styles.fillBtn}
            >
              Autocompletar
            </button>
          </div>
          <p className={styles.testCredentialsData}>
            <strong>Email:</strong> cliente@utem.cl<br />
            <strong>Clave:</strong> Password123!
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="tu.correo@ejemplo.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verificando credenciales..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className={styles.footerText}>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/registro" className={styles.link}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
