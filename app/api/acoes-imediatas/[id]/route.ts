import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific acoes imediatas by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const acao = await db.accoesImediatasECorrectivas.findUnique({
      where: {
        id,
      },
    });

    if (!acao) {
      return NextResponse.json(
        { error: 'Ação imediata not found' },
        { status: 404 }
      );
    }

    // Format the response to match frontend expectations
    const formattedAcao = {
      id: acao.id,
      accao: acao.accao,
      descricao: acao.descricao,
      responsavel: acao.responsavel,
      data: acao.data.toISOString(),
      assinatura: acao.assinatura,
      created_at: acao.createdAt.toISOString(),
      updated_at: acao.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedAcao);
  } catch (error) {
    console.error('Error fetching ação imediata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ação imediata' },
      { status: 500 }
    );
  }
}

// PUT update an acoes imediatas
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { accao, descricao, responsavel, data, assinatura } = body;

    if (!accao || !descricao || !responsavel || !data || !assinatura) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const acao = await db.accoesImediatasECorrectivas.update({
      where: {
        id,
      },
      data: {
        accao,
        descricao,
        responsavel,
        data: new Date(data),
        assinatura,
      },
    });

    // Format the response to match frontend expectations
    const formattedAcao = {
      id: acao.id,
      accao: acao.accao,
      descricao: acao.descricao,
      responsavel: acao.responsavel,
      data: acao.data.toISOString(),
      assinatura: acao.assinatura,
      created_at: acao.createdAt.toISOString(),
      updated_at: acao.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedAcao);
  } catch (error) {
    console.error('Error updating ação imediata:', error);
    return NextResponse.json(
      { error: 'Failed to update ação imediata' },
      { status: 500 }
    );
  }
}

// DELETE an acoes imediatas
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any reports using this action
    const reportsUsingAction = await db.relatorioAcidenteIncidente.findFirst({
      where: {
        accoesImediatasECorrectivas: {
          some: {
            id,
          },
        },
      },
    });

    if (reportsUsingAction) {
      return NextResponse.json(
        {
          error:
            'Cannot delete ação imediata that is in use by incident reports',
        },
        { status: 400 }
      );
    }

    await db.accoesImediatasECorrectivas.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ação imediata:', error);
    return NextResponse.json(
      { error: 'Failed to delete ação imediata' },
      { status: 500 }
    );
  }
}
