export const TrimesterNames = ["1ste Trimester", "2de Trimester", "3de Trimester", "Kamp"];

export const TrimOptions = TrimesterNames.map((t, i) => ({
      value: String(i),
      label: t,
    }));