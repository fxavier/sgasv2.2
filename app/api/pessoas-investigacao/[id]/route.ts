import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific person by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const person = await db.pessoasEnvolvidasNaInvestigacao.findUnique({
      where: {
        id,
      },
    });

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Format the response to match frontend expectations
    const formattedPerson = {
      id: person.id,
      nome: person.nome,
      empresa: person.empresa,
      actividade: person.actividade,
      assinatura: person.assinatura,
      data: person.data.toISOString(),
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPerson);
  } catch (error) {
    console.error('Error fetching person:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person' },
      { status: 500 }
    );
  }
}

// PUT update a person
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { nome, empresa, actividade, assinatura, data } = body;

    if (!nome || !empresa || !actividade || !assinatura || !data) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const person = await db.pessoasEnvolvidasNaInvestigacao.update({
      where: {
        id,
      },
      data: {
        nome,
        empresa,
        actividade,
        assinatura,
        data: new Date(data),
      },
    });

    // Format the response to match frontend expectations
    const formattedPerson = {
      id: person.id,
      nome: person.nome,
      empresa: person.empresa,
      actividade: person.actividade,
      assinatura: person.assinatura,
      data: person.data.toISOString(),
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPerson);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json(
      { error: 'Failed to update person' },
      { status: 500 }
    );
  }
}

// DELETE a person
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any reports using this person
    const reportsUsingPerson = await db.relatorioAcidenteIncidente.findFirst({
      where: {
        pessoasEnvolvidasNaInvestigacao: {
          some: {
            id,
          },
        },
      },
    });

    if (reportsUsingPerson) {
      return NextResponse.json(
        { error: 'Cannot delete person that is in use by incident reports' },
        { status: 400 }
      );
    }

    await db.pessoasEnvolvidasNaInvestigacao.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json(
      { error: 'Failed to delete person' },
      { status: 500 }
    );
  }
}
