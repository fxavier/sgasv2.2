import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all incident reports
export async function GET() {
  try {
    const reports = await db.relatorioAcidenteIncidente.findMany({
      include: {
        departamento: true,
        subprojecto: true,
        pessoaEnvolvida: {
          include: {
            departamento: true,
          },
        },
        pessoasEnvolvidasNaInvestigacao: true,
        accoesImediatasECorrectivas: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedReports = reports.map((report) => ({
      id: report.id,
      nome: report.nome,
      funcao: report.funcao,
      departamento: report.departamento
        ? {
            id: report.departamento.id,
            name: report.departamento.name,
          }
        : null,
      subprojecto: report.subprojecto
        ? {
            id: report.subprojecto.id,
            name: report.subprojecto.name,
          }
        : null,
      data: report.data.toISOString(),
      hora: report.hora.toISOString(),
      local: report.local,
      actividadeEmCurso: report.actividadeEmCurso,
      descricaoDoAcidente: report.descricaoDoAcidente,
      tipoDeIncidente: report.tipoDeIncidente,
      equipamentoEnvolvido: report.equipamentoEnvolvido,
      observacao: report.observacao,
      colaboradorEnvolvidoOutroAcidenteAntes:
        report.colaboradorEnvolvidoOutroAcidenteAntes,
      realizadaAnaliseRiscoImpactoAmbientalAntes:
        report.realizadaAnaliseRiscoImpactoAmbientalAntes,
      existeProcedimentoParaActividade: report.existeProcedimentoParaActividade,
      colaboradorRecebeuTreinamento: report.colaboradorRecebeuTreinamento,
      incidenteEnvolveEmpreteiro: report.incidenteEnvolveEmpreteiro,
      nomeComercialEmpreteiro: report.nomeComercialEmpreteiro,
      naturezaEExtensaoIncidente: report.naturezaEExtensaoIncidente,
      possiveisCausasAcidenteMetodologia:
        report.possiveisCausasAcidenteMetodologia,
      possiveisCausasAcidenteEquipamentos:
        report.possiveisCausasAcidenteEquipamentos,
      possiveisCausasAcidenteMaterial: report.possiveisCausasAcidenteMaterial,
      possiveisCausasAcidenteColaboradores:
        report.possiveisCausasAcidenteColaboradores,
      possiveisCausasAcidenteAmbienteESeguranca:
        report.possiveisCausasAcidenteAmbienteESeguranca,
      possiveisCausasAcidenteMedicoes: report.possiveisCausasAcidenteMedicoes,
      pessoaEnvolvida: {
        id: report.pessoaEnvolvida.id,
        nome: report.pessoaEnvolvida.nome,
        departamento: {
          id: report.pessoaEnvolvida.departamento.id,
          name: report.pessoaEnvolvida.departamento.name,
        },
        outrasInformacoes: report.pessoaEnvolvida.outrasInformacoes,
      },
      pessoasEnvolvidasNaInvestigacao:
        report.pessoasEnvolvidasNaInvestigacao.map((person) => ({
          id: person.id,
          nome: person.nome,
          empresa: person.empresa,
          actividade: person.actividade,
          assinatura: person.assinatura,
          data: person.data.toISOString(),
        })),
      accoesImediatasECorrectivas: report.accoesImediatasECorrectivas.map(
        (acao) => ({
          id: acao.id,
          accao: acao.accao,
          descricao: acao.descricao,
          responsavel: acao.responsavel,
          data: acao.data.toISOString(),
          assinatura: acao.assinatura,
        })
      ),
      fotografiaFrontal: report.fotografiaFrontal,
      fotografiaPosterior: report.fotografiaPosterior,
      fotografiaLateralDireita: report.fotografiaLateralDireita,
      fotografiaLateralEsquerda: report.fotografiaLateralEsquerda,
      fotografiaDoMelhorAngulo: report.fotografiaDoMelhorAngulo,
      fotografia: report.fotografia,
      criadoEm: report.criadoEm.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('Error fetching incident reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident reports' },
      { status: 500 }
    );
  }
}

// POST create a new incident report
export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('Received request body:', JSON.stringify(body, null, 2));

    const {
      nome,
      funcao,
      departamento,
      subprojecto,
      data,
      hora,
      local,
      actividadeEmCurso,
      descricaoDoAcidente,
      tipoDeIncidente,
      equipamentoEnvolvido,
      observacao,
      colaboradorEnvolvidoOutroAcidenteAntes,
      realizadaAnaliseRiscoImpactoAmbientalAntes,
      existeProcedimentoParaActividade,
      colaboradorRecebeuTreinamento,
      incidenteEnvolveEmpreteiro,
      nomeComercialEmpreteiro,
      naturezaEExtensaoIncidente,
      possiveisCausasAcidenteMetodologia,
      possiveisCausasAcidenteEquipamentos,
      possiveisCausasAcidenteMaterial,
      possiveisCausasAcidenteColaboradores,
      possiveisCausasAcidenteAmbienteESeguranca,
      possiveisCausasAcidenteMedicoes,
      pessoaEnvolvida,
      pessoasEnvolvidasNaInvestigacao,
      accoesImediatasECorrectivas,
      fotografiaFrontal,
      fotografiaPosterior,
      fotografiaLateralDireita,
      fotografiaLateralEsquerda,
      fotografiaDoMelhorAngulo,
      fotografia,
    } = body;

    console.log('Extracted request fields:', {
      nome,
      funcao,
      data,
      hora,
      local,
      pessoaEnvolvida,
      pessoasEnvolvidasNaInvestigacao: JSON.stringify(
        pessoasEnvolvidasNaInvestigacao
      ),
      accoesImediatasECorrectivas: JSON.stringify(accoesImediatasECorrectivas),
    });

    // Validate required fields
    if (
      !nome ||
      !funcao ||
      !data ||
      !hora ||
      !local ||
      !actividadeEmCurso ||
      !descricaoDoAcidente ||
      !tipoDeIncidente ||
      !equipamentoEnvolvido ||
      !pessoaEnvolvida
    ) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Check if pessoa envolvida exists
      console.log(
        'Checking if pessoa envolvida exists with ID:',
        pessoaEnvolvida.id
      );
      const existingPessoa = await db.pessoaEnvolvida.findUnique({
        where: {
          id: pessoaEnvolvida.id,
        },
      });

      if (!existingPessoa) {
        console.log('Pessoa envolvida not found with ID:', pessoaEnvolvida.id);
        return NextResponse.json(
          {
            error: `Pessoa envolvida not found with ID: ${pessoaEnvolvida.id}`,
          },
          { status: 404 }
        );
      }
      console.log('Pessoa envolvida found:', existingPessoa);

      // Validate pessoas envolvidas na investigacao
      if (
        pessoasEnvolvidasNaInvestigacao &&
        pessoasEnvolvidasNaInvestigacao.length > 0
      ) {
        console.log('Validating pessoas envolvidas na investigacao');
        for (const pessoa of pessoasEnvolvidasNaInvestigacao) {
          console.log('Checking pessoa investigacao with ID:', pessoa.id);
          const existingPessoa =
            await db.pessoasEnvolvidasNaInvestigacao.findUnique({
              where: {
                id: pessoa.id,
              },
            });

          if (!existingPessoa) {
            console.log(
              `Pessoa envolvida na investigacao with ID ${pessoa.id} not found`
            );
            return NextResponse.json(
              {
                error: `Pessoa envolvida na investigacao with ID ${pessoa.id} not found`,
              },
              { status: 404 }
            );
          }
        }
      }

      // Validate acoes imediatas e correctivas
      if (
        accoesImediatasECorrectivas &&
        accoesImediatasECorrectivas.length > 0
      ) {
        console.log('Validating acoes imediatas e correctivas');
        for (const acao of accoesImediatasECorrectivas) {
          console.log('Checking acao with ID:', acao.id);
          const existingAcao = await db.accoesImediatasECorrectivas.findUnique({
            where: {
              id: acao.id,
            },
          });

          if (!existingAcao) {
            console.log(
              `Acao imediata e correctiva with ID ${acao.id} not found`
            );
            return NextResponse.json(
              {
                error: `Acao imediata e correctiva with ID ${acao.id} not found`,
              },
              { status: 404 }
            );
          }
        }
      }

      console.log('All validations passed, creating report');

      // Prepare the data structure for Prisma
      const createData = {
        nome,
        funcao,
        departamentoId: departamento?.id,
        subprojectoId: subprojecto?.id,
        data: new Date(data),
        hora: new Date(hora),
        local,
        actividadeEmCurso,
        descricaoDoAcidente,
        tipoDeIncidente,
        equipamentoEnvolvido,
        observacao,
        colaboradorEnvolvidoOutroAcidenteAntes,
        realizadaAnaliseRiscoImpactoAmbientalAntes,
        existeProcedimentoParaActividade,
        colaboradorRecebeuTreinamento,
        incidenteEnvolveEmpreteiro,
        nomeComercialEmpreteiro,
        naturezaEExtensaoIncidente,
        possiveisCausasAcidenteMetodologia,
        possiveisCausasAcidenteEquipamentos,
        possiveisCausasAcidenteMaterial,
        possiveisCausasAcidenteColaboradores,
        possiveisCausasAcidenteAmbienteESeguranca,
        possiveisCausasAcidenteMedicoes,
        pessoaEnvolvidaId: pessoaEnvolvida.id,
        pessoasEnvolvidasNaInvestigacao: {
          connect: pessoasEnvolvidasNaInvestigacao
            ? pessoasEnvolvidasNaInvestigacao.map((pessoa: { id: string }) => ({
                id: pessoa.id,
              }))
            : [],
        },
        accoesImediatasECorrectivas: {
          connect: accoesImediatasECorrectivas
            ? accoesImediatasECorrectivas.map((acao: { id: string }) => ({
                id: acao.id,
              }))
            : [],
        },
        fotografiaFrontal,
        fotografiaPosterior,
        fotografiaLateralDireita,
        fotografiaLateralEsquerda,
        fotografiaDoMelhorAngulo,
        fotografia,
      };

      console.log('Create data:', JSON.stringify(createData, null, 2));

      // Create the incident report
      const report = await db.relatorioAcidenteIncidente.create({
        data: createData,
        include: {
          departamento: true,
          subprojecto: true,
          pessoaEnvolvida: {
            include: {
              departamento: true,
            },
          },
          pessoasEnvolvidasNaInvestigacao: true,
          accoesImediatasECorrectivas: true,
        },
      });

      console.log('Report created successfully with ID:', report.id);

      // Format the response to match frontend expectations
      const formattedReport = {
        id: report.id,
        nome: report.nome,
        funcao: report.funcao,
        departamento: report.departamento
          ? {
              id: report.departamento.id,
              name: report.departamento.name,
            }
          : null,
        subprojecto: report.subprojecto
          ? {
              id: report.subprojecto.id,
              name: report.subprojecto.name,
            }
          : null,
        data: report.data.toISOString(),
        hora: report.hora.toISOString(),
        local: report.local,
        actividadeEmCurso: report.actividadeEmCurso,
        descricaoDoAcidente: report.descricaoDoAcidente,
        tipoDeIncidente: report.tipoDeIncidente,
        equipamentoEnvolvido: report.equipamentoEnvolvido,
        observacao: report.observacao,
        colaboradorEnvolvidoOutroAcidenteAntes:
          report.colaboradorEnvolvidoOutroAcidenteAntes,
        realizadaAnaliseRiscoImpactoAmbientalAntes:
          report.realizadaAnaliseRiscoImpactoAmbientalAntes,
        existeProcedimentoParaActividade:
          report.existeProcedimentoParaActividade,
        colaboradorRecebeuTreinamento: report.colaboradorRecebeuTreinamento,
        incidenteEnvolveEmpreteiro: report.incidenteEnvolveEmpreteiro,
        nomeComercialEmpreteiro: report.nomeComercialEmpreteiro,
        naturezaEExtensaoIncidente: report.naturezaEExtensaoIncidente,
        possiveisCausasAcidenteMetodologia:
          report.possiveisCausasAcidenteMetodologia,
        possiveisCausasAcidenteEquipamentos:
          report.possiveisCausasAcidenteEquipamentos,
        possiveisCausasAcidenteMaterial: report.possiveisCausasAcidenteMaterial,
        possiveisCausasAcidenteColaboradores:
          report.possiveisCausasAcidenteColaboradores,
        possiveisCausasAcidenteAmbienteESeguranca:
          report.possiveisCausasAcidenteAmbienteESeguranca,
        possiveisCausasAcidenteMedicoes: report.possiveisCausasAcidenteMedicoes,
        pessoaEnvolvida: {
          id: report.pessoaEnvolvida.id,
          nome: report.pessoaEnvolvida.nome,
          departamento: {
            id: report.pessoaEnvolvida.departamento.id,
            name: report.pessoaEnvolvida.departamento.name,
          },
          outrasInformacoes: report.pessoaEnvolvida.outrasInformacoes,
        },
        pessoasEnvolvidasNaInvestigacao:
          report.pessoasEnvolvidasNaInvestigacao.map((person) => ({
            id: person.id,
            nome: person.nome,
            empresa: person.empresa,
            actividade: person.actividade,
            assinatura: person.assinatura,
            data: person.data.toISOString(),
          })),
        accoesImediatasECorrectivas: report.accoesImediatasECorrectivas.map(
          (acao) => ({
            id: acao.id,
            accao: acao.accao,
            descricao: acao.descricao,
            responsavel: acao.responsavel,
            data: acao.data.toISOString(),
            assinatura: acao.assinatura,
          })
        ),
        fotografiaFrontal: report.fotografiaFrontal,
        fotografiaPosterior: report.fotografiaPosterior,
        fotografiaLateralDireita: report.fotografiaLateralDireita,
        fotografiaLateralEsquerda: report.fotografiaLateralEsquerda,
        fotografiaDoMelhorAngulo: report.fotografiaDoMelhorAngulo,
        fotografia: report.fotografia,
        criadoEm: report.criadoEm.toISOString(),
        updatedAt: report.updatedAt.toISOString(),
      };

      return NextResponse.json(formattedReport, { status: 201 });
    } catch (error) {
      console.error('Error in database operations:', error);
      return NextResponse.json(
        {
          error: `Database error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating incident report:', error);
    return NextResponse.json(
      {
        error: `Failed to create incident report: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 }
    );
  }
}
