import { useState, useEffect } from 'react';

interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        
        // Crear un timeout para la petición
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag,idd', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Error al cargar los países');
        }
        
        const data = await response.json();
        
        // Procesar datos y extraer información relevante
        const processedCountries = data
          .map((country: any) => {
            // Manejar códigos telefónicos de manera más robusta
            let dialCode = '';
            if (country.idd && country.idd.root) {
              dialCode = country.idd.root;
              if (country.idd.suffixes && country.idd.suffixes.length > 0) {
                dialCode += country.idd.suffixes[0];
              }
            }
            
            return {
              name: country.name?.common || 'País desconocido',
              code: country.cca2 || 'XX',
              flag: country.flag || '🏳️',
              dialCode: dialCode
            };
          })
          .filter((country: Country) => country.dialCode && country.dialCode.length > 0)
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        
        setCountries(processedCountries);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Timeout al cargar países');
        } else {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
