pH Scale model

See PHModel for implementation.

Limits:

pH range = [-1,15]
volume range = [0,1.2] L

Definitions:

H2O = water
H3O = hydronium (H3O+)
OH = hydroxide (OH-)
A = Avogadro's number (6.023E23)
V = volume in liters (L)
N = number of molecules

Given a volume of liquid with some pH...

Concentration of H3O = 10^-pH.

Concentration of OH = 10^-pOH, where pOH=14-pH.

Concentration of H2O = 55 / V

Number of molecules of H3O = (10^-pH)*A*V

Number of molecules of OH = (10^-pOH)*A*V or 10^(pH-14)*A*V

Number of molecules of H2O = 55*A*V

If two volumes of liquid 1 & 2 are added, the new volume = V1 + V2

If combining 2 acids (or acid and water), pH = -log(((10^-pH1)*V1 + (10^-pH2)*V2) / (V1 + V2))

If combining 2 bases (or base and water), pH = 14 + log(((10^(pH1 - 14)*V1)+(10^(14-pH2)*V2)) / (V1 + V2))

If concentration of H30 is changed, volume is unchanged, and pH = -log(concentration of H3O)

If concentration of OH is changed, volume is unchanged, and pH = 14 - (-log(concentration of OH))

If #moles of H30 is changed, volume is unchanged, and pH = -log ((new #moles H30) / V)

If #moles of OH is changed,, volume is unchanged, and pH = 14 - (-log((new # moles OH) / V))
