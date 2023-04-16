figure;
tiempo = load('C:\Users\milla\.vscode\DS\tiempo_respuesta_15minutos.txt');

plot(tiempo(:,1), '-o');
title('Gráfico con TTL de 15 minutos');
xlabel('Número de consulta');
ylabel('Tiempo de respuesta');

figure;
tiempo = load('C:\Users\milla\.vscode\DS\tiempo_respuesta_30 segundos.txt');

plot(tiempo(:,1), '-o');
title('Gráfico con TTL de 30 segundos')
xlabel('Número de consulta')
ylabel('Tiempo de respuesta')

figure;
tiempo = load('C:\Users\milla\.vscode\DS\tiempo_respuesta_1segundo.txt');

plot(tiempo(:,1), '-o');
title('Gráfico con TTL de 1 segundo')
xlabel('Número de consulta')
ylabel('Tiempo de respuesta')