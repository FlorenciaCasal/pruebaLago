"use client";
import React from "react";
import Scanner from "../../components/Scanner"


export default function ScannerPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Checkear usuario</h1>
      <Scanner/>
    </main>
  );
}