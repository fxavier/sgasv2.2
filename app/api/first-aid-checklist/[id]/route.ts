import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific first aid kit checklist item by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const checklist = await db.listaVerificacaoKitPrimeirosSocorros.findUnique({
      where: {
        id,
      },
    });

    if (!checklist) {
      return NextResponse.json(
        { error: 'First aid kit checklist not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedChecklist);
  } catch (error) {
    console.error('Error fetching first aid kit checklist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch first aid kit checklist' },
      { status: 500 }
    );
  }
}

// PUT update a first aid kit checklist item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    const checklist = await db.listaVerificacaoKitPrimeirosSocorros.update({
      where: {
        id,
      },
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

    return NextResponse.json(formattedChecklist);
  } catch (error) {
    console.error('Error updating first aid kit checklist:', error);
    return NextResponse.json(
      { error: 'Failed to update first aid kit checklist' },
      { status: 500 }
    );
  }
}

// DELETE a first aid kit checklist item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if the checklist exists
    const existingChecklist =
      await db.listaVerificacaoKitPrimeirosSocorros.findUnique({
        where: {
          id,
        },
      });

    if (!existingChecklist) {
      return NextResponse.json(
        { error: 'First aid kit checklist not found' },
        { status: 404 }
      );
    }

    await db.listaVerificacaoKitPrimeirosSocorros.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting first aid kit checklist:', error);
    return NextResponse.json(
      { error: 'Failed to delete first aid kit checklist' },
      { status: 500 }
    );
  }
}
