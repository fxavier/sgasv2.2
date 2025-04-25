import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all first aid kit checklist items
export async function GET() {
  try {
    const checklists = await db.listaVerificacaoKitPrimeirosSocorros.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedChecklists = checklists.map((checklist) => ({
      id: checklist.id,
      descricao: checklist.descricao,
      quantidade: checklist.quantidade,
      data: checklist.data.toISOString(),
      prazo: checklist.prazo.toISOString(),
      observacao: checklist.observacao,
      inspecao_realizada_por: checklist.inspecaoRealizadaPor,
      created_at: checklist.createdAt.toISOString(),
      updated_at: checklist.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedChecklists);
  } catch (error) {
    console.error('Error fetching first aid kit checklists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch first aid kit checklists' },
      { status: 500 }
    );
  }
}

// POST create a new first aid kit checklist item
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      descricao,
      quantidade,
      data,
      prazo,
      observacao,
      inspecao_realizada_por,
    } = body;

    if (
      !descricao ||
      quantidade === undefined ||
      !data ||
      !prazo ||
      !inspecao_realizada_por
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const checklist = await db.listaVerificacaoKitPrimeirosSocorros.create({
      data: {
        descricao,
        quantidade,
        data: new Date(data),
        prazo: new Date(prazo),
        observacao: observacao || '',
        inspecaoRealizadaPor: inspecao_realizada_por,
      },
    });

    // Format the response to match frontend expectations
    const formattedChecklist = {
      id: checklist.id,
      descricao: checklist.descricao,
      quantidade: checklist.quantidade,
      data: checklist.data.toISOString(),
      prazo: checklist.prazo.toISOString(),
      observacao: checklist.observacao,
      inspecao_realizada_por: checklist.inspecaoRealizadaPor,
      created_at: checklist.createdAt.toISOString(),
      updated_at: checklist.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedChecklist, { status: 201 });
  } catch (error) {
    console.error('Error creating first aid kit checklist:', error);
    return NextResponse.json(
      { error: 'Failed to create first aid kit checklist' },
      { status: 500 }
    );
  }
}
