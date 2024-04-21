@echo off
set nombre_contenedor=%1

echo Deteniendo el contenedor %nombre_contenedor%...

echo volvemos a correr el contenedor 
docker start %nombre_contenedor%

echo El contenedor %nombre_contenedor% ha sido reiniciado exitosamente en el puerto %puerto%.
