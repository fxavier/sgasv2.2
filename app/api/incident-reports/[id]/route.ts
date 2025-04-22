import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific incident report by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const report = await db.relatorioAcidenteIncidente.findUnique({
      where: {
        id,
      },
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

    if (!report) {
      return NextResponse.json(
        { error: 'Incident report not found' },
        { status: 404 }
      );
    }

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
    };

    return NextResponse.json(formattedReport);
  } catch (error) {
    console.error('Error fetching incident report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident report' },
      { status: 500 }
    );
  }
}

// PUT update an incident report
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

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
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the report exists
    const existingReport = await db.relatorioAcidenteIncidente.findUnique({
      where: {
        id,
      },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Incident report not found' },
        { status: 404 }
      );
    }

    // Check if pessoa envolvida exists
    const existingPessoa = await db.pessoaEnvolvida.findUnique({
      where: {
        id: pessoaEnvolvida.id,
      },
    });

    if (!existingPessoa) {
      return NextResponse.json(
        { error: 'Pessoa envolvida not found' },
        { status: 404 }
      );
    }

    // Validate pessoas envolvidas na investigacao
    if (
      pessoasEnvolvidasNaInvestigacao &&
      pessoasEnvolvidasNaInvestigacao.length > 0
    ) {
      for (const pessoa of pessoasEnvolvidasNaInvestigacao) {
        const existingPessoa =
          await db.pessoasEnvolvidasNaInvestigacao.findUnique({
            where: {
              id: pessoa.id,
            },
          });

        if (!existingPessoa) {
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
    if (accoesImediatasECorrectivas && accoesImediatasECorrectivas.length > 0) {
      for (const acao of accoesImediatasECorrectivas) {
        const existingAcao = await db.accoesImediatasECorrectivas.findUnique({
          where: {
            id: acao.id,
          },
        });

        if (!existingAcao) {
          return NextResponse.json(
            {
              error: `Acao imediata e correctiva with ID ${acao.id} not found`,
            },
            { status: 404 }
          );
        }
      }
    }

    // First, disconnect all existing relationships
    await db.relatorioAcidenteIncidente.update({
      where: { id },
      data: {
        pessoasEnvolvidasNaInvestigacao: {
          set: [], // Disconnect all existing connections
        },
        accoesImediatasECorrectivas: {
          set: [], // Disconnect all existing connections
        },
      },
    });

    // Then update the report with new data
    const report = await db.relatorioAcidenteIncidente.update({
      where: {
        id,
      },
      data: {
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
      },
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
    };

    return NextResponse.json(formattedReport);
  } catch (error) {
    console.error('Error updating incident report:', error);
    return NextResponse.json(
      { error: 'Failed to update incident report' },
      { status: 500 }
    );
  }
}

// DELETE an incident report
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the report exists
    const existingReport = await db.relatorioAcidenteIncidente.findUnique({
      where: {
        id,
      },
    });

    if (!existingReport) {
      return NextResponse.json(
        { error: 'Incident report not found' },
        { status: 404 }
      );
    }

    // First, disconnect all relationships
    await db.relatorioAcidenteIncidente.update({
      where: { id },
      data: {
        pessoasEnvolvidasNaInvestigacao: {
          set: [], // Disconnect all existing connections
        },
        accoesImediatasECorrectivas: {
          set: [], // Disconnect all existing connections
        },
      },
    });

    // Then delete the report
    await db.relatorioAcidenteIncidente.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting incident report:', error);
    return NextResponse.json(
      { error: 'Failed to delete incident report' },
      { status: 500 }
    );
  }
}
