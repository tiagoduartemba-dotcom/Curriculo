(function () {
  "use strict";

  const LINKEDIN = "#0a66c2";
  const MUTED = "#e0e0e0";

  function initSkillBars() {
    document.querySelectorAll(".skill-bar[data-skill][data-value]").forEach((el) => {
      const label = el.dataset.skill;
      const value = Math.min(100, Math.max(0, Number(el.dataset.value) || 0));

      el.innerHTML = `
        <div class="skill-bar__header">
          <span>${label}</span>
          <span class="skill-bar__pct">${value}%</span>
        </div>
        <div class="skill-bar__track">
          <div class="skill-bar__fill" style="width: 0" data-target="${value}"></div>
        </div>
      `;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".skill-bar__fill").forEach((fill) => {
            if (fill.dataset.animated) return;
            fill.dataset.animated = "true";
            fill.style.width = `${fill.dataset.target}%`;
          });
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".skills__bars").forEach((section) => observer.observe(section));
  }

  Chart.defaults.font.family = "'Montserrat', system-ui, sans-serif";
  Chart.defaults.color = "rgba(0,0,0,0.6)";

  function initRadarChart() {
    const canvas = document.getElementById("radarChart");
    if (!canvas) return;

    new Chart(canvas, {
      type: "radar",
      data: {
        labels: ["Logística", "Estoque", "Dados / BI", "Varejo", "Processos", "Liderança"],
        datasets: [{
          data: [95, 92, 85, 90, 88, 82],
          backgroundColor: "rgba(10, 102, 194, 0.2)",
          borderColor: LINKEDIN,
          borderWidth: 2,
          pointBackgroundColor: LINKEDIN,
          pointBorderColor: "#fff",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: MUTED },
            angleLines: { color: MUTED },
            pointLabels: { font: { size: 11, weight: "600" } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  function createDonut(canvasId, percent, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: [label, ""],
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: [LINKEDIN, MUTED],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                return ctx.dataIndex === 0 ? `${label}: ${percent}%` : "";
              },
            },
          },
        },
      },
      plugins: [{
        id: "centerText",
        afterDraw(chart) {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          ctx.save();
          ctx.font = "bold 13px Montserrat, sans-serif";
          ctx.fillStyle = LINKEDIN;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            `${percent}%`,
            (chartArea.left + chartArea.right) / 2,
            (chartArea.top + chartArea.bottom) / 2
          );
          ctx.restore();
        },
      }],
    });
  }

  function initDonutCharts() {
    createDonut("donutExcel", 93, "Excel");
    createDonut("donutSAP", 90, "SAP");
    createDonut("donutDash", 88, "Dashboards");
    createDonut("donutPython", 55, "Python");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSkillBars();

    const btn = document.getElementById("btnPrint");
    if (btn) btn.addEventListener("click", () => window.print());

    initRadarChart();
    initDonutCharts();
  });
})();
