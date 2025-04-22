import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all acoes imediatas
export async function GET() {
  try {
    const acoes = await db.accoesImediatasECorrectivas.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedAcoes = acoes.map((acao) => ({
      id: acao.id,
      accao: acao.accao,
      descricao: acao.descricao,
      responsavel: acao.responsavel,
      data: acao.data.toISOString(),
      assinatura: acao.assinatura,
      created_at: acao.createdAt.toISOString(),
      updated_at: acao.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedAcoes);
  } catch (error) {
    console.error('Error fetching acoes imediatas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch acoes imediatas' },
      { status: 500 }
    );
  }
}

// POST create a new acoes imediatas
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { accao, descricao, responsavel, data, assinatura } = body;

    if (!accao || !descricao || !responsavel || !data || !assinatura) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const acao = await db.accoesImediatasECorrectivas.create({
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

    return NextResponse.json(formattedAcao, { status: 201 });
  } catch (error) {
    console.error('Error creating ação imediata:', error);
    return NextResponse.json(
      { error: 'Failed to create ação imediata' },
      { status: 500 }
    );
  }
}
