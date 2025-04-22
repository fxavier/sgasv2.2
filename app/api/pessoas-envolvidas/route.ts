import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all people involved in accidents
export async function GET() {
  try {
    const people = await db.pessoaEnvolvida.findMany({
      include: {
        departamento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response to match frontend expectations
    const formattedPeople = people.map((person) => ({
      id: person.id,
      nome: person.nome,
      departamento: {
        id: person.departamento.id,
        name: person.departamento.name,
      },
      outrasInformacoes: person.outrasInformacoes,
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedPeople);
  } catch (error) {
    console.error('Error fetching people involved:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people involved' },
      { status: 500 }
    );
  }
}

// POST create a new person involved
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nome, departamento, outrasInformacoes } = body;

    if (!nome || !departamento || !outrasInformacoes) {
      return NextResponse.json(
        { error: 'Name, department, and additional information are required' },
        { status: 400 }
      );
    }

    // Check if department exists
    const departmentExists = await db.department.findUnique({
      where: {
        id: departamento.id,
      },
    });

    if (!departmentExists) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    const person = await db.pessoaEnvolvida.create({
      data: {
        nome,
        departamentoId: departamento.id,
        outrasInformacoes,
      },
      include: {
        departamento: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedPerson = {
      id: person.id,
      nome: person.nome,
      departamento: {
        id: person.departamento.id,
        name: person.departamento.name,
      },
      outrasInformacoes: person.outrasInformacoes,
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPerson, { status: 201 });
  } catch (error) {
    console.error('Error creating person involved:', error);
    return NextResponse.json(
      { error: 'Failed to create person involved' },
      { status: 500 }
    );
  }
}
